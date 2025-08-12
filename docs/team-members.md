{
  "name": "Team Members",
  "description": "",
  "displayField": "teamMemberName",
  "fields": [
    {
      "id": "teamMemberName",
      "name": "Team Member Name",
      "type": "Symbol",
      "localized": false,
      "required": true,
      "validations": [
        {
          "unique": true
        }
      ],
      "disabled": false,
      "omitted": false
    },
    {
      "id": "slug",
      "name": "Slug",
      "type": "Symbol",
      "localized": false,
      "required": true,
      "validations": [
        {
          "unique": true
        }
      ],
      "disabled": false,
      "omitted": false
    },
    {
      "id": "title",
      "name": "Title",
      "type": "Symbol",
      "localized": false,
      "required": false,
      "validations": [],
      "disabled": false,
      "omitted": false
    },
    {
      "id": "email",
      "name": "Email",
      "type": "Symbol",
      "localized": false,
      "required": false,
      "validations": [],
      "disabled": false,
      "omitted": false
    },
    {
      "id": "phone",
      "name": "Phone",
      "type": "Symbol",
      "localized": false,
      "required": false,
      "validations": [],
      "disabled": false,
      "omitted": false
    },
    {
      "id": "linkedIn",
      "name": "LinkedIn",
      "type": "Symbol",
      "localized": false,
      "required": false,
      "validations": [],
      "disabled": false,
      "omitted": false
    },
    {
      "id": "twitter",
      "name": "Twitter",
      "type": "Symbol",
      "localized": false,
      "required": false,
      "validations": [],
      "disabled": false,
      "omitted": false
    },
    {
      "id": "about",
      "name": "About",
      "type": "Text",
      "localized": false,
      "required": false,
      "validations": [],
      "disabled": false,
      "omitted": false
    },
    {
      "id": "photo",
      "name": "Photo",
      "type": "Link",
      "localized": false,
      "required": false,
      "validations": [],
      "disabled": false,
      "omitted": false,
      "linkType": "Asset"
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
    "id": "teamMembers",
    "type": "ContentType",
    "createdAt": "2025-08-11T13:14:26.143Z",
    "updatedAt": "2025-08-11T13:49:23.264Z",
    "environment": {
      "sys": {
        "id": "master",
        "type": "Link",
        "linkType": "Environment"
      }
    },
    "publishedVersion": 5,
    "publishedAt": "2025-08-11T13:49:23.264Z",
    "firstPublishedAt": "2025-08-11T13:14:26.522Z",
    "createdBy": {
      "sys": {
        "type": "Link",
        "linkType": "User",
        "id": "5sQpYFO33Yqg3UbmXo6n8F"
      }
    },
    "updatedBy": {
      "sys": {
        "type": "Link",
        "linkType": "User",
        "id": "5sQpYFO33Yqg3UbmXo6n8F"
      }
    },
    "publishedCounter": 3,
    "version": 6,
    "publishedBy": {
      "sys": {
        "type": "Link",
        "linkType": "User",
        "id": "5sQpYFO33Yqg3UbmXo6n8F"
      }
    },
    "urn": "crn:contentful:::content:spaces/zama0c17ivw2/environments/master/content_types/teamMembers"
  }
}