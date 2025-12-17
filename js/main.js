(function ($) {
    "use strict";
    
    // Dropdown on mouse hover
    $(document).ready(function () {
        function toggleNavbarMethod() {
            if ($(window).width() > 992) {
                $('.navbar .dropdown').on('mouseover', function () {
                    $('.dropdown-toggle', this).trigger('click');
                }).on('mouseout', function () {
                    $('.dropdown-toggle', this).trigger('click').blur();
                });
            } else {
                $('.navbar .dropdown').off('mouseover').off('mouseout');
            }
        }
        toggleNavbarMethod();
        $(window).resize(toggleNavbarMethod);
    });


    // Date and time picker
    $('.date').datetimepicker({
        format: 'L'
    });
    $('.time').datetimepicker({
        format: 'LT'
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Price carousel
    $(".price-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        margin: 45,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsive: {
            0:{
                items:1
            },
            992:{
                items:2
            },
            1200:{
                items:3
            }
        }
    });


    // Team carousel
    $(".team-carousel, .related-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        margin: 45,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsive: {
            0:{
                items:1
            },
            992:{
                items:2
            }
        }
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        items: 1,
        dots: true,
        loop: true,
    });
    
})(jQuery);


function toggleSOS() {
  const popup = document.getElementById("sos-popup");
  popup.style.display = popup.style.display === "block" ? "none" : "block";
}







/* ================= MASKED NAME GENERATOR ================= */
const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function getRandomMaskedName() {
  const letter = alphabets[Math.floor(Math.random() * alphabets.length)];
  return letter + "***";
}

/* ================= WORLDWIDE CITIES ================= */
const proofCities = [

  // INDIA
  "Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad",
  "Pune", "Ahmedabad", "Kolkata", "Jaipur", "Kochi",

  // UAE
  "Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Al Ain",

  // SAUDI ARABIA
  "Riyadh", "Jeddah", "Dammam", "Mecca", "Medina",

  // QATAR
  "Doha",

  // KUWAIT
  "Kuwait City",

  // OMAN
  "Muscat", "Salalah",

  // BAHRAIN
  "Manama",

  // OTHER GULF
  "Al Khobar", "Dhahran",

  // EUROPE
  "London", "Manchester", "Paris", "Berlin", "Rome",

  // USA
  "New York", "Los Angeles", "Chicago", "Houston", "Miami",

  // ASIA
  "Singapore", "Bangkok", "Kuala Lumpur", "Jakarta",

  // AUSTRALIA
  "Sydney", "Melbourne",

  // AFRICA
  "Nairobi", "Johannesburg"
];

/* ================= SOCIAL PROOF FUNCTION ================= */
function showSocialProof() {
  const box = document.getElementById("social-proof");
  const text = document.getElementById("proof-text");

  const name = getRandomMaskedName();
  const city = proofCities[Math.floor(Math.random() * proofCities.length)];

  text.innerHTML = `<strong>${name}</strong> from <strong>${city}</strong> just requested a free quotation`;

  box.classList.remove("hidden");

  setTimeout(() => {
    box.classList.add("hidden");
  }, 5000);
}

/* Start after page load */
setTimeout(showSocialProof, 6000);

/* Repeat every 18 seconds */
setInterval(showSocialProof, 18000);

