<div class="og-lms-grid">
    <section class="og-lms-card">
        <h2><?php echo esc_html__('My Enrolled Courses', OG_LMS_TEXT_DOMAIN); ?></h2>
        <?php if (empty($courses)) : ?>
            <p><?php echo esc_html__('No active enrollments yet.', OG_LMS_TEXT_DOMAIN); ?></p>
        <?php else : ?>
            <ul>
                <?php foreach ($courses as $course) : ?>
                    <li>
                        <a href="<?php echo esc_url($course['url']); ?>"><?php echo esc_html($course['title']); ?></a>
                    </li>
                <?php endforeach; ?>
            </ul>
        <?php endif; ?>
    </section>

    <section class="og-lms-card">
        <h2><?php echo esc_html__('Quick Links', OG_LMS_TEXT_DOMAIN); ?></h2>
        <ul>
            <li><a href="<?php echo esc_url(OG_LMS_Helpers::public_base_url() . '/courses'); ?>">Courses</a></li>
            <li><a href="<?php echo esc_url(OG_LMS_Helpers::public_base_url() . '/my-certificates'); ?>">Certificates</a></li>
            <li><a href="<?php echo esc_url(OG_LMS_Helpers::public_base_url() . '/live-classes'); ?>">Live Classes</a></li>
        </ul>
    </section>
</div>
