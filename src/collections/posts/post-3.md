---
title: Insomnia Faker Gotcha
description: Why Faker fails in pre-request scripts—and a simple workaround that actually works.
pubDate: 2026-02-27
image:
  url: /assets/images/2026-02-27.png
  alt: Insomnia Faker Gotcha
tags: [insomnia,api testing,faker,test automation]
---
## Introduction

While working with dynamic test data in Insomnia, it is common to rely on Faker‑style placeholders to generate randomized values. However, not all parts of Insomnia support the same syntax, and this can lead to unexpected behavior when building automated or scripted requests.

This post walks through a real issue I encountered, why it happens, and a reliable approach you can use to generate random data before sending a request.

## The Issue: Request Body Is Not Rendered in Pre‑Request Scripts

The starting point was simple: I wanted to inspect and manipulate the request body inside a pre‑request script. But I quickly noticed something important: **The request body is not rendered yet inside a pre‑request script**.

Instead of processed values, the script receives the raw template, for example:

```json
{
  "id": "{% faker 'randomDomainWord' %}"
}
```

Because of this, I looked for alternatives and found examples of using `replaceIn` to manually render template expressions:

```js
insomnia.environment.replaceIn("{{ _.variable }}"); 
```

This works for environment variables but using Faker tags like `{% faker 'randomUUID' %}` resulted in a rendering error.

## Why the Error Happens

The root cause is that **the `faker` block tag is not supported by the `replaceIn` method**.

Additionally:

1. The Faker library is not exposed to pre‑request or post‑request scripts.
2. You cannot import or call Faker directly.
3. Only certain placeholder identifiers are recognized by the internal rendering engine.

This left an open question: **How can we generate random data in a pre‑request script if we cannot use `faker` tags or import Faker?**

## Digging Deeper: The Hidden Syntax

After reading through Insomnia’s source code, I found internal comments referencing an alternative set of identifiers that _are_ supported by `replaceIn`:

```js
/**
   * Replaces placeholders in the given template string with values from the environment object.
   *
   * It supports following placeholders:
   * - `insomnia.environment.replaceIn("My id is {{$randomUUID}}")`, which generates a random UUID.
   * - `insomnia.environment.replaceIn("Visiting URL: {{urlValueFromEnvironment}}")`, which replaces `urlValueFromEnvironment` with the value of that variable in the active environment.
   *
   * @param template - The template string containing placeholders to be replaced.
   * @returns The rendered string with placeholders replaced by their corresponding values.
   *
   * @throws Will throw an error if template is not a string or object.
   */
  replaceIn = (template: string | object) => {
    if (typeof template === 'object') {
      template = template.toString();
    } else if (typeof template !== 'string') {
      throw new TypeError('The template must be a string or an object');
    }

    return getInterpolator().render(template, this.toObject());
  };
```

These dollar‑prefixed placeholders map internally to specific Faker functions. They are simply not documented, which is why they are so hard to discover.

Armed with this information, I adapted the workflow to use this syntax instead.

## How to Find the Correct Placeholder for Any Faker Tag

Fortunately, there is a simple way to discover which `$placeholder` corresponds to a given Faker tag, directly inside Insomnia.

1. Open any request field (URL, body, header, environment, etc.).
2. Press **Ctrl + Enter** (Windows/Linux) or **Cmd + Enter** (macOS).
3. In the search box that appears, type **"random"**.
4. Insomnia will show a full list of available Faker‑related tags.
5. Each entry has a **display name**, and that display name directly corresponds to the placeholder you can use inside `replaceIn`.

For example:

- If the UI shows **Faker → randomUUID**, the corresponding placeholder is `{{ $randomUUID }}`
- If the UI shows **Faker → randomDomainWord**, the placeholder is `{{ $randomDomainWord }}`

You can use any of these placeholders safely within `replaceIn`, even though the standard `{% faker ... %}` syntax is not supported there.

## A Reliable Approach Using Pre‑Request Scripts

A clean workaround is to generate your request body in a pre‑request script and store it as a variable.

1. Generate and store the request body

   ```js
   const body = {
     id: insomnia.environment.replaceIn("{{ $randomDomainWord }}"),
     name: insomnia.environment.replaceIn("{{ $randomLoremSlug }}"),
     specifications: {},
     type: "ML",
   };

   insomnia.variables.set("BODY", body);
   ```

2. Render the body in the request itself

   ```jinja
   {{ BODY | dump | safe }}
   ```

   The `dump` filter recursively expands nested objects, preventing `[object Object]` issues.

3. Use it anywhere you need. Because the body is stored as a variable, you can access it again in post‑request scripts or chained requests.

## Use Cases

- *Randomized API payloads*

   Works well for services requiring unique values per request while keeping full control over the payload.

- *Consistent multi‑step workflows*

   The same random values are reused across multiple requests.

- *Constructing complex nested objects*

   Building JSON in JavaScript is cleaner than embedding large template blocks.

- *QA automation and exploratory testing*

   Reliable random data generation without relying on undocumented syntax.

## Conclusion

The `replaceIn` method does not support the `faker` block tag, and Faker is not available inside scripting contexts. However, Insomnia provides internal placeholder identifiers such as `{{ $randomUUID }}` that are compatible with `replaceIn`.

By combining these with pre‑request scripts, you can generate dynamic, randomized request bodies in a stable and maintainable way.
