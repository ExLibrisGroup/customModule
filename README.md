# Third Iron Primo NDE Adapter

## Overview

The NDE Customization package offers options to enhance and extend the functionality of Primo’s New Discovery Experience (NDE). This Third Iron Adapter adds LibKey support directly into the Primo NDE experience.

The NDE UI supports loading of custom modules at runtime and also provides infrastructure to dynamically load add-ons developed by vendors, consortia, or community members. This enables seamless integration, allowing institutions to configure and deploy external add-ons through **Add-On Configuration in Alma**.

The NDE UI add-on framework allows various stakeholders to develop and integrate custom functionality:

- **Vendors** can create and host services that institutions can seamlessly incorporate into their environment.
- **Institutions and consortia** can develop and share custom components, enabling consistency and collaboration across multiple libraries.

Library staff can easily add, configure, and manage these add-ons through Alma, following guidelines provided by the stakeholders. These typically include:

- **Add-on Name** – The identifier used in Alma’s configuration.
- **Add-on URL** – The location where the add-on is hosted (static folder to load the add-on at runtime).
- **Configuration Parameters** – JSON-based config parameters to be referenced at runtime by the add-on.

![Add-on Overview](./readme-files/addon-overview.png)

## Prerequisites

**Note:**
The NDE Customization package is currently available exclusively to Primo customers who have early access to the New Discovery Experience (NDE). Further availability will be announced in upcoming releases.

## Using the Third Iron Primo NDE Adapter

### Step 1: Create NDE view in Alma (if not present)

1. In Alma, navigate to **Discovery > Configure Views**

   ![Alma Configure Views section](./readme-files/alma-configure-views.png)

2. On the View List screen, select "Add View"

   ![Add new view in Alma](./readme-files/alma-add-view.png)

3. Configure the view as needed, making sure to check the NDE checkbox

   ![Configure new view in Alma](./readme-files/alma-view-configuration.png)

### Step 2: Update the default configuration file

Fill in your LibKey **Library ID** and **API Key**, along with your **Unpaywall Email Address**. Update the other boolean configuration values as needed.

Default configuration JSON:

```
  {
    "apiKey": "your-libkey-api-key",
    "libraryId":"your-libkey-library-id",
    "viewOption:"no-stack",
    "unpaywallEmailAddressKey": "your-unpaywall-email-address",
    "journalCoverImagesEnabled": "true",
    "journalBrowZineWebLinkTextEnabled": "true",
    "articleBrowZineWebLinkTextEnabled": "true",
    "articlePDFDownloadLinkEnabled": "true",
    "articleLinkEnabled": "true",
    "printRecordsIntegrationEnabled": "true",
    "showFormatChoice": "false",
    "showLinkResolverLink": "false",
    "enableLinkOptimizer": "true",
    "articleRetractionWatchEnabled": "true",
    "articleExpressionOfConcernEnabled": "true",
    "problematicJournalEnabled": "true",
    "articlePDFDownloadViaUnpaywallEnabled": "true",
    "articleLinkViaUnpaywallEnabled": "true",
    "articleAcceptedManuscriptPDFViaUnpaywallEnabled": "true",
    "articleAcceptedManuscriptArticleLinkViaUnpaywallEnabled": "true"
  }
```

### Step 3: Setup Add-On configuration in Alma

1. In Alma, navigate to the "Configuration" section

   ![Alma configuration](./readme-files/alma-configuration.png)

2. Then go to **Discovery > Add-on Configuration**

   ![Alma configuration](./readme-files/alma-add-on-configuration.png)

   Configure the following:

   - **Add-on Name** – The identifier used in Alma’s configuration (View ID set in step 1).
   - **Add-on URL** – The location where the add-on is hosted (static folder to load the add-on at runtime). The current URL for the LibKey adaptor is `https://browzine-adapters.s3.amazonaws.com/primo-nde/production/` (keep the trailing '/')
   - **Add-on Configuration File** – JSON-based config parameters to be referenced at runtime by the add-on. Upload your modified JSON configuration file from Step 2.

## Custom Labels and Translation

Button label text can be customized and translated by setting up label codes in the Alma database. This can be done manually in a one-by-one way for each label, or en masse by importing a file with multiple labels with their corresponding custom text and translation values.

### Manual entry

1. In Alma, navigate to Discovery > Labels

   ![Alma Discovery](./readme-files/alma-discovery.png)

   ![Alma Labels](./readme-files/alma-labels.png)

2. find "View Labels" table and click the hamburger menu on the right to find the "edit" option. Then click "Add Row"

   ![Alma View Labels](./readme-files/alma-view-labels.png)

   ![Alma View Labels Edit](./readme-files/alma-view-labels-edit.png)

   ![Alma Add Row](./readme-files/alma-add-row.png)

3. The available label codes are as follows:

   - LibKey.articleExpressionOfConcernText
   - LibKey.problematicJournalText
   - LibKey.articlePDFDownloadLinkText
   - LibKey.articleLinkText
   - LibKey.documentDeliveryFulfillmentText
   - LibKey.articlePDFDownloadViaUnpaywallText
   - LibKey.articleLinkViaUnpaywallText
   - LibKey.articleAcceptedManuscriptPDFViaUnpaywallText
   - LibKey.articleAcceptedManuscriptArticleLinkViaUnpaywallText
   - LibKey.journalBrowZineWebLinkText
   - LibKey.articleBrowZineWebLinkText

   Enter one of the above code values in the "Code" field with the English label in the "Description" field

   ![Alma Add Row](./readme-files/alma-expression-of-concern-label.png)

4. To add a translation for different languages, select the language in the Filter top section of the View Labels table view, then add the desired translation string to the "Translation" column for the given label Code.

   ![Alma Add Row](./readme-files/alma-language-select.png)

   ![Alma Add Row](./readme-files/alma-translation-field.png)

## Developer notes

### Adding new icons

1. To add new icons, bring in the .svg file into `/src/assets/icons`. Edit the svg file to have a `color` prop that is dynamically set (see the other svg files for examples).
2. a new icon component needs to be created in `/src/app/components/icons` and imported in `svg-icon.component.ts`.
3. A new case for the switch statement in the svg-icon component template file `svg-icon.component.html` also needs to be added.
4. Also, for icon positioning, make sure to add a class to the svg-icon component's style file (`svg-icon.component.scss`) specific to the new icon or extend existing style classes.

### Environment Variables

The following environment variables are used in CircleCI:

AWS Deployment

- `AWS_ACCESS_KEY` : value stored in keepass
- `AWS_ACCESS_KEY_ID` : value stored in keepass
- `AWS_BUCKET` : thirdiron-adapters
- `AWS_DEFAULT_REGION` : us-east-1
- `AWS_SECRET_ACCESS_KEY` : value stored in keepass

Release Notes Generator

- `RENOGEN_GITHUB_OAUTH_TOKEN` : value stored in keepass

## Additional Resources

### Live Demo Tutorial

- **Customize Primo NDE UI**: Watch the ExLibris live demo on YouTube for a visual guide on how to customize the Primo NDE UI:
  [Customize Primo NDE UI: Live Demo](https://www.youtube.com/watch?v=z06l2hJYuLc)
