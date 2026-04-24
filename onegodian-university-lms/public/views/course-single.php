<?php if ($course) : ?>
    <?php $price_id = trim((string) get_post_meta($course->ID, '_og_stripe_price_id', true)); ?>
    <article class="og-lms-card">
        <h2><?php echo esc_html(get_the_title($course)); ?></h2>
        <div><?php echo wp_kses_post(apply_filters('the_content', $course->post_content)); ?></div>

        <?php if (is_user_logged_in() && $price_id !== '') : ?>
            <p>
                <strong><?php echo esc_html__('Purchase & Enroll', OG_LMS_TEXT_DOMAIN); ?></strong><br>
                <?php echo esc_html__('Use POST /wp-json/og-lms/v1/stripe/checkout-session with course_id to create checkout.', OG_LMS_TEXT_DOMAIN); ?>
            </p>
        <?php elseif ($price_id === '') : ?>
            <p><?php echo esc_html__('Enrollment opens soon. Course checkout is not yet configured.', OG_LMS_TEXT_DOMAIN); ?></p>
        <?php endif; ?>
    </article>
<?php endif; ?>
