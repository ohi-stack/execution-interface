# OneGodian Members & Community

Version `1.9.0` evolves the historical OneGodian Members / INO Platform package into a production membership experience with a consistent account layer, social-community compatibility, widgets, REST API, app bridge, and managed shortcode pages.

## Production rule

Only features that are implemented, permission-controlled, documented, and testable should be represented as operational. BuddyPress/BuddyBoss, WooCommerce, messaging, groups, and social activity are detected dynamically and are shown as connected only when the required component is active.

## Core member experience

The plugin now provides:

- OneGodian membership home
- Login / registration experience
- WooCommerce My Account wrapper
- Member dashboard shell
- Member navigation
- Member profile card
- Profile-completion indicator
- Community hub
- Members directory handoff
- Groups handoff
- Activity handoff
- Private messages handoff
- Notifications handoff
- WordPress widgets
- BuddyPress/BuddyBoss profile navigation integration
- WooCommerce My Account `OneGodian Dashboard` endpoint
- REST API and server-to-server app bridge
- Automatic page creation and safe page updates

## Login behavior

Protected member shortcodes automatically return the branded member-login panel when a visitor is not signed in.

Canonical shortcode:

```text
[onegodian_login]
```

Canonical account shortcode:

```text
[onegodian_my_account]
```

If WooCommerce is active, both use the WooCommerce account/login system. If WooCommerce is not active, the plugin falls back to WordPress login and the WordPress member profile.

A compatibility alias is also registered when another plugin has not already claimed it:

```text
[my-account]
```

The plugin does **not** replace the standard WooCommerce shortcode:

```text
[woocommerce_my_account]
```

## New production shortcodes

```text
[onegodian_membership_hub]
[onegodian_login]
[onegodian_my_account]
[onegodian_member_dashboard_shell]
[onegodian_member_navigation]
[onegodian_member_profile]
[onegodian_profile_completion]
[onegodian_community_hub]
[onegodian_members_directory]
[onegodian_groups]
[onegodian_activity]
[onegodian_messages]
[onegodian_notifications]
[onegodian_members_status]
```

## Existing member shortcodes retained

```text
[onegodian_membership_cta]
[onegodian_members_pricing]
[onegodian_membership_resources]
[onegodian_member_certificates]
[onegodian_member_dashboard]
[onegodian_member_support]
[onegodian_contributors_page]
[onegodian_contributor_tiers]
[onegodian_creator_network]
[onegodian_affiliate_dashboard]
[onegodian_referral_link]
[onegodian_contributor_wall]
[onegodian_contributor_disclaimer]
```

INO Platform module shortcodes remain available as well.

## Auto-generated pages

On activation and plugin-version upgrades, the plugin creates or updates these plugin-managed pages:

| Page | Slug | Shortcode |
|---|---|---|
| OneGodian Membership | `/membership/` | `[onegodian_membership_hub]` |
| Member Dashboard | `/member-dashboard/` | `[onegodian_member_dashboard_shell]` |
| Member Account | `/member-account/` | `[onegodian_my_account]` |
| Member Profile | `/member-profile/` | `[onegodian_member_profile]` |
| OneGodian Community | `/community/` | `[onegodian_community_hub]` |
| Members Directory | `/members/` | `[onegodian_members_directory]` |
| Community Groups | `/member-groups/` | `[onegodian_groups]` |
| Community Activity | `/member-activity/` | `[onegodian_activity]` |
| Member Messages | `/member-messages/` | `[onegodian_messages]` |
| Member Notifications | `/member-notifications/` | `[onegodian_notifications]` |
| Membership Resources | `/membership-resources/` | `[onegodian_membership_resources]` |
| Member Certificates | `/member-certificates/` | `[onegodian_member_certificates]` |
| Join OneGodian | `/join/` | `[onegodian_members_pricing]` |
| Member Login | `/login/` | `[onegodian_login]` |

### Safe update behavior

The plugin inserts a managed marker into pages it owns. On upgrades it may update only:

- pages carrying the OneGodian Members managed marker; or
- empty pages created for one of the canonical slugs.

If a site administrator has populated an existing page with custom content, the plugin marks that page `preserved-unmanaged` and does not overwrite it.

## BuddyPress / BuddyBoss compatibility

When BuddyPress or BuddyBoss is active, OneGodian Members automatically prefers the native community URLs for:

- member directory
- profile
- activity
- groups
- messages
- notifications
- settings

It also adds a private **OneGodian** tab to the signed-in member profile that loads the OneGodian dashboard shell.

When BuddyPress/BuddyBoss is not active, the corresponding OneGodian pages remain available as compatibility surfaces and clearly state that the social component is not connected.

## WooCommerce compatibility

When WooCommerce is active:

- `[onegodian_login]` uses WooCommerce login/registration;
- `[onegodian_my_account]` wraps `[woocommerce_my_account]` in OneGodian branding;
- WooCommerce My Account gains a `OneGodian Dashboard` menu endpoint;
- legacy membership pricing can continue mapping membership products to checkout.

## Widgets

Three WordPress widgets are registered:

1. **OneGodian Member Account** — login for guests, profile for signed-in members.
2. **OneGodian Community** — community hub using BuddyPress/BuddyBoss when connected.
3. **OneGodian Members Status** — plugin, WooCommerce, BuddyPress, and page-sync status.

## REST API

Namespace:

```text
/wp-json/onegodian-members/v1
```

Endpoints:

```text
GET /health
GET /manifest
GET /me
GET /admin/summary
GET /sync/status
```

`/health` and `/manifest` are public-safe service metadata.

`/me` requires a signed-in WordPress user and returns only that member's own public-safe profile information and navigation links.

`/admin/summary` requires `manage_options`.

`/sync/status` requires either `manage_options` or the server-side bridge header:

```text
X-OneGodian-Members-Key: <bridge-key>
```

Never expose this bridge key in browser JavaScript.

## OneGodian App syncing

Default control-plane target:

```text
https://app.onegodian.com/members
```

The WordPress plugin should be treated as the membership/community source and bridge; app.OneGodian.com may consume the health, manifest, and sync/status endpoints server-side to display current capability and page status.

## Admin control

WordPress admin:

```text
INO Platform → Members Production
```

The production screen includes:

- WooCommerce / BuddyPress status
- app URL
- support URL
- auto page-sync switch
- app bridge key
- bridge-key rotation
- managed-page inventory
- one-click managed-page regeneration
- REST endpoint reference
- new shortcode reference

## Branding

The production experience uses the current OneGodian dark presentation system with:

- obsidian / black surfaces
- gold primary accent
- purple secondary accent
- responsive cards
- rounded interface panels
- profile/avatar treatment
- mobile member navigation
- reduced-motion support

## Release checklist

Before promoting a site installation to production:

1. Activate OneGodian Members & Community v1.9.0.
2. Open **Members Production** and confirm managed pages.
3. Confirm WooCommerce My Account login and registration behavior.
4. If BuddyPress/BuddyBoss is installed, verify Members, Activity, Groups, Messages, Notifications, and Profile links.
5. Rotate the app bridge key and configure the matching server-side key in app.OneGodian.com.
6. Verify `/health`, `/manifest`, and `/sync/status`.
7. Test logged-out and logged-in versions of every protected shortcode.
8. Test desktop and mobile member dashboard layouts.
9. Confirm custom existing pages are reported as `preserved-unmanaged` and were not overwritten.
10. Build and redeploy the connected app frontend after app-side changes.
