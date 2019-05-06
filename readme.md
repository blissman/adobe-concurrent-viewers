# Adobe Analytics to CSV

## Overview

This is a tool for downloading data from Adobe Analytics' report APIs and outputting to a CSV (presumably for Excel importation).

## Pre-Requisites

### Adobe Access

In order to use this script, you'll need active Adobe Analytics access, and basic familiarity with the Adobe Analytics website.

### Homebrew

Install [Homebrew](https://brew.sh/) if you're on macOS (it'll make the following installs much easier).

### Node.js

You'll need to install [Node.js](https://nodejs.org/en/) (instructions on site). If you're on macOS and have Homebrew installed, you can do this by typing into your terminal:

```bash
$ brew install node
```

## Using the Script

### Setting Up Your User

Using the ```userTemplate.js``` file as a guide, create a ```user.js``` file in src folder. Fill out your ``user name`` and ```shared secret``` from the ```Admin -> User Management -> Edit User``` console of Adobe Analytics. 

### Setting Up Your Report

Using the ```reportTemplate.js``` file as a guide, create a ```report.js``` file in the src folder. Fill out your ```rsid```, ```segmentid```, and ```start/end dates```. You can leave your ```segmentid``` blank if you want all the data, or obtain your ``segmentid`` by looking at the last query string parameter of your URL when editing your segment.

### Running your Report

If you have everything set up, it should be as simple as going to a new terminal, navigating to this repo and typing in:

```bash
$ sudo node src/getConcurrentViewers.js
```

Keep in mind that you need to use "sudo" to have admin rights ot create your file. Your output files can be found in the reports folder.

## Credits

Credits go to Adobe for their [Marketing Cloud Javascript SDK](https://github.com/Adobe-Marketing-Cloud/marketing-cloud-javascript-sdk).