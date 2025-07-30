# Contentful Content Model: FAQ

This document outlines the content model structure needed in Contentful for FAQ sections on the HELOC360 website.

## Content Model Name: `faq`

### Basic Information Fields

| Field Name | Field Type | Required | Description | Validation |
|------------|------------|----------|-------------|------------|
| `question` | Short text | ✅ Yes | The FAQ question | Max 200 characters |
| `answer` | Long text | ✅ Yes | The FAQ answer | Max 1000 characters |
| `category` | Short text | ✅ Yes | FAQ category for grouping | Max 50 characters |
| `sortOrder` | Number | ❌ No | Display order within category | Integer |

### Display Fields

| Field Name | Field Type | Required | Description | Validation |
|------------|------------|----------|-------------|------------|
| `featured` | Boolean | ❌ No | Whether this FAQ is featured | Default: false |
| `tags` | Short text, list | ❌ No | Tags for filtering and search | Max 10 items, 30 chars each |

## Field Usage on Website

### FAQ Sections
- `question` - FAQ question display
- `answer` - FAQ answer content
- `category` - Section grouping
- `sortOrder` - Display ordering
- `featured` - Highlighted FAQs
- `tags` - Search and filtering

## Suggested Categories

### HELOC Categories
- `heloc-basics`
- `application-process`
- `rates-and-terms`
- `repayment`
- `qualification`

### General Categories
- `getting-started`
- `account-management`
- `technical-support`
- `legal-and-compliance`

## Content Guidelines

### Required for All FAQs
1. **Question** - Clear, commonly asked question
2. **Answer** - Comprehensive, helpful answer
3. **Category** - Appropriate grouping

### Optional Fields
- **Sort Order** - Logical ordering within categories
- **Featured** - Mark most important FAQs
- **Tags** - Relevant topic tags

## FAQ Writing Best Practices

### Questions
- Use natural language customers would use
- Start with question words (What, How, When, Why)
- Keep concise but specific

### Answers
- Provide complete, actionable answers
- Use simple, clear language
- Include relevant links when helpful
- Address follow-up questions
