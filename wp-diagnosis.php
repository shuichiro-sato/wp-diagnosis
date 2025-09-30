
<?php
/**
 * Plugin Name: WP Diagnosis (GAS proxy)
 * Description: 適性診断UI + WP REST → GAS プロキシ。ショートコード [diagnosis]
 * Version: 1.0.0
 */

if (!defined('ABSPATH')) exit;

// === 設定（ここだけ環境に合わせて変更） ===
define('DIAG_GAS_URL', 'https://script.google.com/macros/s/AKfycbwBa6ypJ5_WFmt8t_wkd2CaWDw6hFLn33JES_JwPYxuG2Bqu_G8fv0mBZ0XsXLYeK07/exec');

// --- ショートコード本体 ---
function diag_render_shortcode() {
  // このページでだけ読み込む
  $ver = '1.0.0';
  $base = plugin_dir_url(__FILE__) . 'assets/';

  // Chart.js（CDNでも可）
  wp_enqueue_script('diag-chart', 'https://cdn.jsdelivr.net/npm/chart.js', [], null, true);

  wp_enqueue_style('diag-style', $base.'style.css', [], $ver);
  wp_enqueue_script('diag-app',   $base.'app.js', ['diag-chart'], $ver, true);

  // JS へ環境値を渡す（WP REST 経由で GAS へプロキシ）
  wp_localize_script('diag-app', 'DIAG', [
    'restRoot' => esc_url_raw( rest_url('hc/v1/') ),
    'restNonce'=> wp_create_nonce('wp_rest')
  ]);

  // 埋め込み用の最小 HTML（CodePen の中身は JS が生成）
  return '<div id="progressWrap"></div><div id="app"></div>';
}
add_shortcode('diagnosis', 'diag_render_shortcode');

// --- REST ルート（/wp-json/hc/v1/sheet） ---
add_action('rest_api_init', function () {
  register_rest_route('hc/v1', '/sheet', [
    'methods'  => 'POST',
    'callback' => 'diag_proxy_to_gas',
    'permission_callback' => function () {
      // 同一オリジンからのみ（公開ページで動かすので WP Nonce を検証）
      return wp_verify_nonce($_SERVER['HTTP_X_WP_NONCE'] ?? '', 'wp_rest');
    },
    'args' => [
      'action'  => ['required' => true],
    ],
  ]);
});

function diag_proxy_to_gas(WP_REST_Request $req) {
  $body = $req->get_json_params();
  if (!$body) return new WP_REST_Response(['ok'=>false,'error'=>'empty body'], 400);

  $resp = wp_remote_post(DIAG_GAS_URL, [
    'headers' => ['Content-Type' => 'application/json'],
    'timeout' => 20,
    'body'    => wp_json_encode($body),
  ]);

  if (is_wp_error($resp)) {
    return new WP_REST_Response(['ok'=>false,'error'=>$resp->get_error_message()], 502);
  }
  $code = wp_remote_retrieve_response_code($resp);
  $json = json_decode(wp_remote_retrieve_body($resp), true);

  if ($code !== 200 || !is_array($json)) {
    return new WP_REST_Response(['ok'=>false,'error'=>'GAS bad response','code'=>$code], 502);
  }
  return new WP_REST_Response($json, 200);
}
