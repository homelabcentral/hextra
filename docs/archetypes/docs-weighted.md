---
title: "{{ replace .File.ContentBaseName "-" " " | title }}"
{{- $section := site.GetPage (path.Dir .File.Path) }}
{{- $max := 0 }}
{{- range $section.RegularPages }}
  {{- with .Params.weight }}{{ if gt . $max }}{{ $max = . }}{{ end }}{{ end }}
{{- end }}
weight: {{ add $max 1 }}
tags: []
---
