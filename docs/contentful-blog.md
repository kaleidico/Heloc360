{
  "name": "Blog Posts",
  "description": "",
  "displayField": "title",
  "fields": [
    {
      "id": "title",
      "name": "Title",
      "type": "Symbol",
      "localized": false,
      "required": true,
      "validations": [],
      "disabled": false,
      "omitted": false
    },
    {
      "id": "slug",
      "name": "Slug",
      "type": "Symbol",
      "localized": false,
      "required": true,
      "validations": [],
      "disabled": false,
      "omitted": false
    },
    {
      "id": "categories",
      "name": "Categories",
      "type": "Array",
      "localized": false,
      "required": false,
      "validations": [],
      "disabled": false,
      "omitted": false,
      "items": {
        "type": "Symbol",
        "validations": []
      }
    },
    {
      "id": "content",
      "name": "Content",
      "type": "Text",
      "localized": false,
      "required": false,
      "validations": [],
      "disabled": false,
      "omitted": false
    },
    {
      "id": "publishDate",
      "name": "Date & Time",
      "type": "Date",
      "localized": false,
      "required": true,
      "validations": [],
      "disabled": false,
      "omitted": false
    },
    {
      "id": "featureImage",
      "name": "Feature Image",
      "type": "Link",
      "localized": false,
      "required": false,
      "validations": [],
      "disabled": false,
      "omitted": false,
      "linkType": "Asset"
    },
    {
      "id": "seoTitle",
      "name": "SEO Title",
      "type": "Symbol",
      "localized": false,
      "required": false,
      "validations": [],
      "disabled": false,
      "omitted": false
    },
    {
      "id": "seoDescription",
      "name": "SEO Description",
      "type": "Text",
      "localized": false,
      "required": false,
      "validations": [],
      "disabled": false,
      "omitted": false
    },
    {
      "id": "seoKeyword",
      "name": "SEO Keyword",
      "type": "Symbol",
      "localized": false,
      "required": false,
      "validations": [],
      "disabled": false,
      "omitted": false
    },
    {
      "id": "focusKeywords",
      "name": "Focus Keywords",
      "type": "Array",
      "localized": false,
      "required": false,
      "validations": [],
      "disabled": false,
      "omitted": false,
      "items": {
        "type": "Symbol",
        "validations": []
      }
    },
    {
      "id": "excerpt",
      "name": "Excerpt",
      "type": "Text",
      "localized": false,
      "required": false,
      "validations": [],
      "disabled": false,
      "omitted": false
    }
  ],
  "sys": {
    "space": {
      "sys": {
        "type": "Link",
        "linkType": "Space",
        "id": "zama0c17ivw2"
      }
    },
    "id": "blogPosts",
    "type": "ContentType",
    "createdAt": "2025-08-05T16:32:58.147Z",
    "updatedAt": "2025-08-11T15:40:10.589Z",
    "environment": {
      "sys": {
        "id": "master",
        "type": "Link",
        "linkType": "Environment"
      }
    },
    "publishedVersion": 5,
    "publishedAt": "2025-08-11T15:40:10.589Z",
    "firstPublishedAt": "2025-08-05T16:32:58.344Z",
    "createdBy": {
      "sys": {
        "type": "Link",
        "linkType": "User",
        "id": "0lEjBPsbM1dyVLFawjNwWs"
      }
    },
    "updatedBy": {
      "sys": {
        "type": "Link",
        "linkType": "User",
        "id": "0lEjBPsbM1dyVLFawjNwWs"
      }
    },
    "publishedCounter": 3,
    "version": 6,
    "publishedBy": {
      "sys": {
        "type": "Link",
        "linkType": "User",
        "id": "0lEjBPsbM1dyVLFawjNwWs"
      }
    },
    "urn": "crn:contentful:::content:spaces/zama0c17ivw2/environments/master/content_types/blogPosts"
  }
}