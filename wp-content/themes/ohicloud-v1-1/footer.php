<?php if (!defined('ABSPATH')) { exit; } ?>
</main>
<footer class="site-footer">
  <div class="wrap footer-grid">
    <div>
      <h4>Platform</h4>
      <?php wp_nav_menu(['theme_location' => 'footer_platform', 'container' => false, 'fallback_cb' => '__return_empty_string']); ?>
    </div>
    <div>
      <h4>Products</h4>
      <?php wp_nav_menu(['theme_location' => 'footer_products', 'container' => false, 'fallback_cb' => '__return_empty_string']); ?>
    </div>
    <div>
      <h4>Developers</h4>
      <?php wp_nav_menu(['theme_location' => 'footer_developers', 'container' => false, 'fallback_cb' => '__return_empty_string']); ?>
    </div>
    <div>
      <h4>Company / Legal</h4>
      <?php wp_nav_menu(['theme_location' => 'footer_company_legal', 'container' => false, 'fallback_cb' => '__return_empty_string']); ?>
    </div>
  </div>
</footer>
<?php wp_footer(); ?>
</body>
</html>
