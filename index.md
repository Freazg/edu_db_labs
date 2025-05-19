---
layout: default
---

# EDU DB Labs

Это главная страница репозитория лабораторных работ.

## Содержание репозитория

{% include_relative README.md %}

## Лабораторные работы:

{% for file in site.static_files %}
  {% assign path_parts = file.path | split: "/" %}
  {% if file.name == "README.md" and path_parts.size > 2 %}
    {% assign folder = path_parts[1] %}
    * [{{ folder }}]({{ site.baseurl }}/{{ folder }}/)
  {% endif %}
{% endfor %}
