<?php if ($course) : ?>
    <article class="og-lms-card">
        <h2><?php echo esc_html(get_the_title($course)); ?></h2>
        <div><?php echo wp_kses_post(apply_filters('the_content', $course->post_content)); ?></div>
    </article>
<?php endif; ?>
