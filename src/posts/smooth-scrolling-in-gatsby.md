---
slug: gatsby-smooth-scrolling
title: Smooth Scrolling in Gatsby
date: 2019-03-22T05:00:12.437Z
tags:
  - gatsby
  - gatsby link
  - ux
  - smooth-scroll
---
Getting smooth scrolling set up can make a nice addition to the user experience of your site. Being able to click on a link and getting a smooth transition can give a nice flow that is less jarring than the web default of a sharp transition.

When I was building this blog, I decided that I wanted to have a contact form at the bottom of every page that could be transitioned to via the contact button at the top.

### No more reinventing the wheel

I could have built it from scratch but why reinvent the wheel, especially when other people have already figured out [how to do it properly for accessibility](https://css-tricks.com/smooth-scrolling-accessibility/) and other configurations.

Many tools exist for this but I decided to use [`smooth-scroll`](https://www.npmjs.com/package/smooth-scroll) because I've used it before and I like the presets as well as how easy it is to configure.

I found [this article from Chris Fitkin](https://medium.com/@chrisfitkin/how-to-smooth-scroll-links-in-gatsby-3dc445299558) that showed how to get smooth scrolling working in a Gatbsy app but it didn't work for a multi-page app when the link was present across all pages in the app, such as a link in the header or footer.

### Where the magic happens

1. After jumping to my terminal, I added the package to my project.

   `npm install --save smooth-scroll`.

2. At the top of my `layout.js`, a template component that wraps all of the other components of my site inside of it, I included the following after the `import` statements but before the component is rendered. This attaches `smooth-scroll` to all a tags, which Gatsby Link is under the hood, with a to value containing a hashtag.

```js
    if (typeof window !== "undefined") {
      // eslint-disable-next-line global-require
      require("smooth-scroll")('a[href*="#"]')
    }
```

3. I then added the id property to the element I wanted to navigate to, this was in my Contact Form component.

   `<ContactForm id="contact" />`

4. After that I added a [Gatsby Link Element](https://www.gatsbyjs.org/docs/gatsby-link/) to my header and set the `to` property to point to the id of the `ContactForm` component

   `<Link to="#contact">Contact</Link>`

5. This works for links on the home page, but if someone clicked on that link from a blog post, it would take them back to the index page's contact form because of the way Gatsby's Link Component is configured. In order to set it up for every page, I used the [`Location Component`](https://reach.tech/router/api/Location) from Reach Router, which Gatsby uses under the hood to get access to the current location via a render prop. 

   Then, with some string interpolation I set up the new and improved value for the `to` property.
   
   ```javascript
   <Link to={`${location.pathname}#contact`}></Link>`
   ```

### et voila!
We now have smooth scrolling across the site! All we have to do is update the second part of the to value to use it for other links if we want to have another header or footer link with the same functionality
