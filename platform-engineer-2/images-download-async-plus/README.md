# Image downloader

## Tech Stack

- NodeJs 16 or higher is required.

## Installing

Run inside project root folder:

```bash

npm install

```

## Running 


### Tests

```bash

npm run test

```

### Coverage

```bash

npm run coverage

```

### Lint

```bash

npm run lint

```

### Lint fix

```bash

npm run lint-fix

```

## Instructions

We provided a npm script that runs the code with the following command:

```bash

npm run download-images <json-file-path> <destination-folder>

```

Example of JSON file:

```json
{
  "images": [
    "https://www.w3schools.com/w3css/img_lights.jpg",
    "https://www.w3schools.com/w3css/img_forest.jpg",
    "https://www.w3schools.com/w3css/img_mountains.jpg",
    "https://www.w3schools.com/w3css/img_snowtops.jpg"
  ]
}
```

A sample json file `sample-input.json` was provided in the project root folder


### Challenge Requeriments:

- The function must download the images and save them in the local folder's.
- This folders must be named after the domain name of the URL's. Is is per domain, for example. `w3schools` and `google.images` are separated folders in side of the root destination folder
- Also, the images that are larger than 1MB in size must not be downloaded and an log must be produced without stopping the function.
- Furthermore, the function must return a list of the downloaded images paths.