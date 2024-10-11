// File: frontend/src/utils/main.js
import $ from 'jquery'; // Ensure jQuery is imported
import 'jquery.easing'; // Import the easing plugin

export default function initializeNavbar() {
  "use strict";

  // Spinner (Optional, if you have a spinner)
  var spinner = function () {
    setTimeout(function () {
      if ($('#spinner').length > 0) {
        $('#spinner').removeClass('show');
      }
    }, 1);
  };
  spinner();

  // Sticky Navbar
  $(window).scroll(function () {
    if ($(this).scrollTop() > 45) {
      $('.navbar').addClass('sticky-top shadow-sm');
    } else {
      $('.navbar').removeClass('sticky-top shadow-sm');
    }
  });

  // Back to top button visibility
  $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
      $('.back-to-top').fadeIn('slow');
    } else {
      $('.back-to-top').fadeOut('slow');
    }
  });

  // Smooth scrolling for back-to-top button with faster speed
  $('.back-to-top').click(function (e) {
    e.preventDefault(); // Prevent the default anchor click behavior
    $('html, body').animate({ scrollTop: 0 }, 500, 'easeInOutExpo'); // Set duration to 500ms for faster scrolling
    return false; // Prevent further bubbling of click event
  });
}