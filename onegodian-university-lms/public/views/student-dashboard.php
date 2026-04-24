<div class="og-lms-grid">
    <section class="og-lms-card">
        <h2><?php echo esc_html__('Membership', OG_LMS_TEXT_DOMAIN); ?></h2>
        <?php if ($membership) : ?>
            <p>
                <?php echo esc_html(sprintf('Tier: %s', ucfirst((string) $membership['tier']))); ?><br>
                <?php echo esc_html(sprintf('Status: %s', (string) $membership['status'])); ?><br>
                <?php if (! empty($membership['renews_at'])) : ?>
                    <?php echo esc_html(sprintf('Renews: %s', (string) $membership['renews_at'])); ?>
                <?php endif; ?>
            </p>
        <?php else : ?>
            <p><?php echo esc_html__('No active membership found.', OG_LMS_TEXT_DOMAIN); ?></p>
            <p><a href="<?php echo esc_url(OG_LMS_Helpers::public_base_url() . '/pricing'); ?>"><?php echo esc_html__('Upgrade Membership', OG_LMS_TEXT_DOMAIN); ?></a></p>
        <?php endif; ?>
    </section>

    <section class="og-lms-card">
        <h2><?php echo esc_html__('My Enrolled Courses', OG_LMS_TEXT_DOMAIN); ?></h2>
        <?php if (empty($courses)) : ?>
            <p><?php echo esc_html__('No active enrollments yet.', OG_LMS_TEXT_DOMAIN); ?></p>
        <?php else : ?>
            <ul>
                <?php foreach ($courses as $course) : ?>
                    <li>
                        <a href="<?php echo esc_url((string) $course['url']); ?>"><?php echo esc_html((string) $course['title']); ?></a>
                    </li>
                <?php endforeach; ?>
            </ul>
        <?php endif; ?>
    </section>

    <section class="og-lms-card">
        <h2><?php echo esc_html__('Locked Courses', OG_LMS_TEXT_DOMAIN); ?></h2>
        <?php if (empty($locked_courses)) : ?>
            <p><?php echo esc_html__('No locked courses. Great progress!', OG_LMS_TEXT_DOMAIN); ?></p>
        <?php else : ?>
            <ul>
                <?php foreach ($locked_courses as $course) : ?>
                    <li>
                        <?php echo esc_html((string) $course['title']); ?>
                        (<?php echo esc_html(sprintf('requires %s', (string) $course['required_tier'])); ?>)
                    </li>
                <?php endforeach; ?>
            </ul>
            <p><a href="<?php echo esc_url(OG_LMS_Helpers::public_base_url() . '/pricing'); ?>"><?php echo esc_html__('View Upgrade Options', OG_LMS_TEXT_DOMAIN); ?></a></p>
        <?php endif; ?>
    </section>

    <section class="og-lms-card">
        <h2><?php echo esc_html__('Quick Links', OG_LMS_TEXT_DOMAIN); ?></h2>
        <ul>
            <li><a href="<?php echo esc_url(OG_LMS_Helpers::public_base_url() . '/courses'); ?>"><?php echo esc_html__('Courses', OG_LMS_TEXT_DOMAIN); ?></a></li>
            <li><a href="<?php echo esc_url(OG_LMS_Helpers::public_base_url() . '/my-certificates'); ?>"><?php echo esc_html__('Certificates', OG_LMS_TEXT_DOMAIN); ?></a></li>
            <li><a href="<?php echo esc_url(OG_LMS_Helpers::public_base_url() . '/live-classes'); ?>"><?php echo esc_html__('Live Classes', OG_LMS_TEXT_DOMAIN); ?></a></li>
        </ul>
    </section>
</div>
