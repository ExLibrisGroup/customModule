
# customModule
NDE Customization package
	This package offers options to enhance and extend the functionality of Primo’s New Discovery Experience NDE: add and develop your own components, custom theme template  and tailor tour discovery interface to your needs.
=======
# CustomModule

Node.js and npm (Node Package Manager)
1.	Verify Node.js and npm Installation:
   
  •	Open a terminal.

  •	Type node -v and press Enter to check for Node.js.

  •	Type npm -v and press Enter to check for npm.

  •	If Node.js and npm are installed, you'll see the version numbers. If not, you'll see an error indicating that Node.js or npm is not recognized.

4.	Install Node.js and npm (if not installed):
   
  •	Visit the Node.js download page.

  •	Download the version for your operating system (npm is included with Node.js).

  •	Follow the installation instructions on the page.

Angular CLI

  1.	Verify Angular CLI Installation:
     
    •	Open a terminal.

    •	Type ng version and press Enter.

    •	If Angular CLI is installed, you'll see the version number and installed Angular packages. If not, you'll see an error indicating that Angular CLI is not recognized.

  3.	Install Angular CLI (if not installed):
  4.	
    •	After installing Node.js and npm, you can install Angular CLI globally by running:
          npm install -g @angular/cli
    	
    •	This command installs the Angular CLI to be used in all your Angular projects.
 


## Development server

Step 1: 

Downloading the Project Zip File

1.	Instructions for Downloading:
   
	•	Navigate to the https://github.com/ExLibrisGroup/customModule/


	•	Download ZIP
	•	Extract zip to development folder
		c:\env\custom-module\  - for example. 



Step 2: 
Installing Dependencies
1.	Inside the customModule directory, install the necessary npm packages:
	•	npm install



## Code scaffolding

Step 3: 
Adding Custom Components (cmd and ng)
1.	 


2.	

3.	Create your custom component(s) in for custom1-module module.
	-- create first existed 
	ng generate component <Component for Custom> --module custom1-module
	Example:
		c:\env\custom-module>ng generate component RecommendationsComponent --module custom1-module
			CREATE src/app/recommendations-component/recommendations-component.component.html (40 bytes)
			CREATE src/app/recommendations-component/recommendations-component.component.spec.ts (686 bytes)
			CREATE src/app/recommendations-component/recommendations-component.component.ts (278 bytes)
			CREATE src/app/recommendations-component/recommendations-component.component.scss (0 bytes)
			UPDATE src/app/custom1-module/custom1-module.module.ts (3279 bytes)

	Adding Custom Components (cmd and ng) Before and After target component
		ng generate component <targetComponent>-before --module custom1-module
		ng generate component <targetComponent>-after --module custom1-module


4.	Connect your component(s) by selector in the selectorComponentMap in custom1-module.module.ts:
	// Define the map
		export const selectorComponentMap = new Map<string, any>([
			['nde-recommendations-before', RecommendationsComponentBefore],
			['nde-recommendations-after', RecommendationsComponentAfter],
			['nde-recommendations', RecommendationsComponent],
			// Add more pairs as needed
			]);


6.	Make customization design in <Component for Custom>.html, <Component for Custom>.ts, <Component for Custom>.scss
	Example:
		src/app/recommendations-component/recommendations-component.component.html,
		src/app/recommendations-component/recommendations-component.component.ts,
		src/app/recommendations-component/recommendations-component.component.scss


	Examples:
 

List of Selectors of Components that extends BaseCustomComponent
	•	nde-full-display-container
	•	nde-full-display-service-container
	•	nde-full-display-details
	•	nde-full-display-links
	•	nde-get-it
	•	nde-tags
	•	nde-view-it
	•	nde-home-page
	•	nde-page-not-found
	•	nde-search-results-container
	•	nde-recommendations
	•	nde-search-results
	•	nde-search-result-container-item
	•	nde-record-almetrics
	•	nde-record-availability
	•	nde-record-checkbox
	•	nde-record-course
	•	nde-record-image
	•	nde-record-indications
	•	nde-record-main-details
	•	nde-record-summary
	•	nde-record-title
	•	nde-record-type
	•	nde-search-bar-filters
	•	nde-search-results-recommendations
	•	nde-copy-to-clipboard
	•	nde-citation-dialog
	•	nde-language-selector-container
	•	nde-language-selector-presenter
	•	nde-main-menu
	•	nde-logo


## Build

Step 4: Building the Project
	1.	Compile the project by running:
		npm run build
	2.	After a successful build, your compiled code will be in the dist/ directory.

Step 5: Packaging for Distribution
	1.	Rename the dist/custom-module folder to match the format INSTNAME-VIEWNAME where INSTNAME and VIEWNAME are specific to your installation.
	2.	Zip the renamed folder for distribution. 
   


## Running unit tests

Step 6: Upload package to view
	1.	Enter to Alma BO -> Discovery -> View List -> Edit -> Tab: Manage Customization Package -> Field: Customization Package
	 
	2.	 Save
	3.	 Go to FE and refresh



>>>>>>> fd647b8 (Initial commit)
