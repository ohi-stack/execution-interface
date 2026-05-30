# Offer Generator Module Notes

## Interface

The `[algq_offer_generator]` shortcode renders a responsive form for offer terms and a result panel with calculated payment values and merge-field previews.

## Source layout

```text
algq-offer-generator/
├── README.md
├── docs/
├── plugin/
│   ├── algq-offer-generator.php
│   ├── assets/
│   ├── includes/
│   └── templates/
└── tests/
```

## WPBakery embed

```text
[vc_column_text]
[algq_offer_generator]
[/vc_column_text]
```
