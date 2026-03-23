<?php if (!defined('ABSPATH')) { exit; } ?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo('charset'); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<header class="site-header">
  <div class="wrap" style="display:flex;justify-content:space-between;align-items:center;">
    <a href="<?php echo esc_url(home_url('/')); ?>" style="color:#fff;font-weight:800;text-decoration:none;">OHICloud™</a>
    <nav class="main-navigation" aria-label="Primary Navigation">
      <?php
      wp_nav_menu([
          'theme_location' => 'primary',
          'container' => false,
          'fallback_cb' => '__return_empty_string',
      ]);
      ?>
    </nav>
  </div>
</header>
<main>
