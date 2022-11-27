# Capstone

My final project for CS50W is based on a project I worked on a few years ago during the COVID-19 pandemic. During lockdown, a group of local people set up a volunteer center to help those who could not get out of their house. The main aspects of this volunteer center were to organise deliveries of food for those who could not get to shops, delivery of medication prescriptions for those who could not leave their house, and welfare check-ups for those who are feeling vulnerable and heavily affected by the pandemic.

I have adapted the project for the CS50W course. There are 3 main areas of the web application.

-   Call Handler Area (Answer calls from clients)
-   Operator Area (Operators fulfil the requests)
-   Client Area (Clients can log in to access services)

#### YouTube Demonstration

[CS50W Project 5 capstone](https://youtu.be/3nDC_PjbKwM)

## Distinctiveness and Complexity

This project is different from the other projects on the course as it is essentially a call center operation app. There are features involved that are not present in the other projects. Such as an autocomplete search for the call handler to find a client. The ability to download a PDF of the request. And the complexity in how the app handles logins and views. For example, there is one log in page, but depending on your account type (Call Handler, Client, Operator), it will take you to the appropriate area of the app.

The app is built using Django, React and Sass. This makes for fluid transitions of the DOM, quick handling of data and consistent styling and animations. On most parts of the different areas on the app you can edit details, edit requests, add requests, delete requests and change the status of requests without reloading the entire page.

There are 4 models in this application. For Users, Deliveries, Prescriptions and Welfare. They all utilise ForeignKey fields. A user can have several of each type of request, and each request model has to access the client, as well as the operator assigned to the model.

There are 2 apps inside the Django project. The API app handles the views and urls and all of the calls to the backend. The Volunteer Center app handles everything else, such as Models, Serializers, and Admin.

For react, I have used webpacks and babel to compile the React code into JS files which are stored in the /static directory and referenced in the layout.html template. I have also used the React-modal.

## What's Contained In Each file

-   `/api/`
    -   `urls.py` - Contains the URLs for the API calls to the backend.
    -   `views.py` - Contains all the views returned by the backend.
-   `/volunteercenter/`
    -   `/src/` - Source files for react compiler.
        -   `/callhandler/` - Holds the Call Handler components.
            -   `callhandler.js` - Base file for Call Handler Area JS script.
            -   `clientDetails.js` - Loads the clients details after search.
            -   `clientSearch.js` - Handles the client searching and how to render the data.
            -   `newClient.js` - Handles adding new client.
        -   `/client/` - Holds the Client components.
            -   `client.js` - Base file for Client Area JS script.
            -   `clientDetails.js` - Loads the clients details on login.
        -   `/components/` - Holds the reusable components.
            -   `buttons.js` - Holds reusable buttons.
            -   `clientOrders.js` - Fetches and loads the clients requests.
            -   `editForm.js` - A form for editing orders.
            -   `forms.js` - Forms for adding requests.
            -   `modal.js` - Modal component for delete confirmation.
            -   `newOrder.js` - Handles new orders.
            -   `orderDetails.js` - Fetches and loads the request details.
            -   `roots.js` - Creates reusable roots for React.
        -   `/operator/` - Holds the Operator components.
            -   `listDisplay.js` - Displays list of orders for operator.
            -   `operator.js` - Base file for Operator Area JS Script.
            -   `operatorDetails.js` - Loads Operator details on login.
            -   `orderDetails.js` - Fetches and loads request details.
            -   `orderList` - Handles how to display the lists of orders (Assigned, Not Assigned)
        -   `/styles/`
            -   `styles.scss` - Sass script for the Sass compiler.
        -   `main.js` - Other base javascript.
    -   `/static/volunteercenter` - Holds compiled static files from React and Sass.
        -   `callHandler.js` - Compiled Call Handler JS.
        -   `client.js` - Compiled Client JS.
        -   `main.js` - Compiled other JS.
        -   `operator.js` - Compiled Operator JS.
        -   `styles.css` - Compiled Sass into CSS.
    -   `/templates/volunteercenter/` - HTML templates.
        -   `callhandler.html` - HTML for Call Handler Area.
        -   `index.html` - HTML for Client Area.
        -   `layout.html`- Base Layout for all HTML files.
        -   `login.html` - Login HTML.
        -   `operator.html` HTML for Operator Area.
        -   `register.html` - Register HTML.
    -   `admin.py` - Admin definitions.
    -   `babel.config.json` - Babel Preset.
    -   `models.py` - Contains the models for the application.
    -   `package.json` - npm dependencies.
    -   `serializer.py` - Serializer definitions for models.
    -   `urls.py` - Contains the URLs to handle register, logout, and log in directed to correct area of the app.
    -   `views.py` - Handles registration and returns correct login views.
    -   `webpack.config.js` - Handles the compiling of React into minified js.
    -   `requirements.txt` - Install npm dependencies.

## How to run

All React and Sass are pre-compiled. You can run the application with:

`python manage.py runserver`

To use the source code you will need to have node.js, npm and Sass installed.

This project uses:

-   `djangorestframework` - API.
-   `reportlab` - Generates PDFs.
-   `Sass` - CSS Compiler.
-   `React`
-   `babel`
-   `webpack`
-   `react-modal` - Modal package for React.
-   `react-search-autocomplete` - Search Autocomplete package for React.

### Install

`pip install -r requirements.txt`

[Download node.js](https://nodejs.org/en/)

In the CPerry90 directory run `npm install -g sass`

You can then set Sass to watch changes in `volunteercenter\src\styles` by using the terminal to run:

`sass --watch volunteercenter/src/styles/styles.scss:volunteercenter/static/volunteercenter/styles.css`

To use webpack and babel with React you will need to install the dependencies from package.json. This will install React, WebPack and Babel.

`cd volunteercenter` - Enter the volunteercenter directory.

`npm install` - Install dependencies

To run the webpack, inside the `/volunteercenter/` directory run:

`npm run dev`

With both Sass and WebPack/Babel watching for changes you can now edit the source code to make changes.

### Login

There are several set logins available for different user types. The passwords are all set to `1234`

#### Usernames:

-   Call Handler `kit@mail.com` (superuser)
-   Delivery Operator `dave@mail.com`
-   Prescription Operator `tom@mail.com`
-   Welfare Operator `sarah@mail.com`
-   Client `lucy@mail.com`

## How the App operates

You are first presented with a login page. From here, when you login, you will be directed to the appropriate area of the application.

#### Call Handlers

Call Handlers can search all users in the user model who are of the type ‘client’. The search starts after 3 characters are entered. The search keys are their first name, last name and postcode. On this page the call handler can also add a new client. When this happens, a password is created and displayed to the call handler to advise the client.

After searching for a client, or creating a client, they are then taken to a view that shows the client's details and the requests associated with that client. From here, the call handler can add a new request, edit the client's details, and view the details for each request where they can edit the request, delete the request, or download a PDF of the request.

#### Operators

Operators are presented with a view of their details, which they can edit, and a view of requests related to their department (Delivery, Prescription, Welfare). There are 2 requests views. The first is all orders in the operators department that are assigned to that operator. At the top are Accepted Orders, indicated in green. At the bottom are Fulfilled Orders, indicated in grey. On the second view is the “Open Orders” (new requests and requests that haven’t been accepted).

On the assigned requests view the operator can view the details of the request, download a PDF, and complete the order, which marks it as Fulfilled. On the Open Orders view the operator can open new requests, indicated in purple, which then marks the request as processing. They can also open processing requests and choose to Accept them, which marks them as Accepted and assigns that request to the operator.

#### Clients

The same as Call Handler view, except without the search.

#### Other info

When adding a new request, an order number is automatically generated. This is done by searching the 3 request models for their order numbers, finding the highest value, and then incrementing that value.

When deleting a request, the request is marked as `archived`. This means the request is still on the database, but is no longer accessed.

As an operator, opening a new request automatically marks it as `processing`.

Registering through the site will create a user as `client`. To create a `handler` or `operator` user, the Super User would need to add the user through the admin area, or change their status if they have an account.

Orders can only be edited if they have not been accepted of completed.
