{% for varname in link %}
{% if varname != "zacshort" %}
{{ translate(link[varname]) }}
{% endif %}
{% endfor %}