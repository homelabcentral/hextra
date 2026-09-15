---
title: Hugging Face
---

A built-in component to link a [Hugging Face](https://huggingface.co) model or
dataset as a card, showing its task, likes and download count.

## Example

A model:

{{< huggingface model="google-bert/bert-base-uncased" >}}

A dataset:

{{< huggingface dataset="stanfordnlp/imdb" >}}

## Usage

```
{{</* huggingface model="google-bert/bert-base-uncased" */>}}
{{</* huggingface dataset="stanfordnlp/imdb" */>}}
```

### Parameters

| Parameter       | Description                               |
| --------------- | ----------------------------------------- |
| `model`         | Model as `owner/name`.                    |
| `dataset`       | Dataset as `owner/name`.                  |
| `showThumbnail` | Show the owner's avatar. Default `false`. |

Pass either `model` or `dataset`, not both — doing so is a build error.

For a model, the tag beside the counts is its pipeline task (`fill-mask`,
`text-generation` and so on). Datasets have no equivalent, so they show
`dataset`.

The API is queried at build time and needs no token. A failed request logs a
warning and falls back to a plain card; `params.repoCards.enable = false` skips
every call.

{{< callout type="info" >}}
Hugging Face counts likes and downloads rather than stars and forks, so these
cards show a heart and a download icon. The shared card partial takes an
arbitrary metrics list for exactly this reason.
{{< /callout >}}
