import { defineArrayMember, defineField, defineType } from "sanity";

const required = (Rule) => Rule.required();

export const siteContent = defineType({
  name: "siteContent",
  title: "Homepage",
  type: "document",
  groups: [
    { name: "copy", title: "Copy", default: true },
    { name: "links", title: "Links" },
    { name: "media", title: "Media" },
  ],
  fields: [
    defineField({ name: "siteName", title: "Site name", type: "string", group: "copy", validation: required }),
    defineField({ name: "openLabel", title: "Open button label", type: "string", group: "copy", validation: required }),
    defineField({ name: "closeLabel", title: "Close button label", type: "string", group: "copy", validation: required }),
    defineField({ name: "introBeforeLogo", title: "Text before logo", type: "string", group: "copy", validation: required }),
    defineField({ name: "introAfterLogo", title: "Introduction", type: "text", rows: 4, group: "copy", validation: required }),
    defineField({
      name: "body",
      title: "Main text",
      type: "array",
      group: "copy",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Heading 2", value: "h2" },
            { title: "Heading 3", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
          marks: {
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  defineField({
                    name: "href",
                    type: "url",
                    title: "URL",
                    validation: (Rule) => Rule.uri({ scheme: ["http", "https", "mailto"] }),
                  }),
                ],
              },
            ],
          },
        }),
      ],
      validation: required,
    }),
    defineField({ name: "ticketText", title: "Ticket message", type: "string", group: "copy", validation: required }),
    defineField({ name: "ticketLinkLabel", title: "Ticket link label", type: "string", group: "copy", validation: required }),
    defineField({ name: "ticketUrl", title: "Ticket URL", type: "url", group: "links", validation: required }),
    defineField({ name: "instagramUrl", title: "Instagram URL", type: "url", group: "links", validation: required }),
    defineField({ name: "inlineLogo", title: "Inline logo", type: "image", group: "media" }),
    defineField({ name: "backgroundVideo", title: "Desktop background video", type: "file", group: "media", options: { accept: "video/mp4" } }),
    defineField({ name: "posterImage", title: "Video poster", type: "image", group: "media" }),
    defineField({ name: "mobileBackground", title: "Mobile background", type: "image", group: "media" }),
    defineField({ name: "patternImage", title: "Logo pattern", type: "image", group: "media" }),
  ],
  preview: {
    select: { title: "siteName", media: "inlineLogo" },
  },
});
