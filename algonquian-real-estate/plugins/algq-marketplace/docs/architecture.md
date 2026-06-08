# Architecture

The plugin is organized around a hardened WordPress bootstrap (`algq-marketplace.php`) that defines constants, loads includes through a safe helper, and initializes services on `plugins_loaded`.

Core components:

- `ALGQ_Marketplace_Activator` handles activation and deactivation.
- `ALGQ_Marketplace_DB` creates and optionally drops custom tables.
- `ALGQ_Marketplace_Roles` manages roles and capabilities.
- `ALGQ_Marketplace_Pages` generates required frontend pages.
- `ALGQ_Marketplace_Shortcodes` renders buyer-facing workflows.
- `ALGQ_Marketplace_Admin` registers protected admin screens and actions.
- `ALGQ_Marketplace_Plugin` wires public assets and REST metadata.
