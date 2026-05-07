$(document).ready(function () {
  let index = 0;
  let isAnimating = false;

  function getVisibleSlides() {
    const slideWidth = $('.slide').outerWidth(true);
    return Math.round($('.slideshow').width() / slideWidth);
  }

  function goToSlide(newIndex) {
    if (isAnimating) return;
    const totalSlides = $('.slide').length;
    const visibleSlides = getVisibleSlides();
    newIndex = Math.max(0, Math.min(newIndex, totalSlides - visibleSlides));
    if (newIndex === index) return;

    isAnimating = true;
    index = newIndex;
    const slideWidth = $('.slide').outerWidth(true);
    $('.slides-track').css('transform', `translateX(-${index * slideWidth}px)`);

    // Update button states
    $('.prev').toggleClass('disabled', index === 0);
    $('.next').toggleClass('disabled', index >= totalSlides - visibleSlides);

    setTimeout(() => { isAnimating = false; }, 520);
  }

  $('.next').click(function () { goToSlide(index + 1); });
  $('.prev').click(function () { goToSlide(index - 1); });

  // Keyboard navigation
  $(document).keydown(function (e) {
    if (e.key === 'ArrowRight') goToSlide(index + 1);
    if (e.key === 'ArrowLeft') goToSlide(index - 1);
    if (e.key === 'Escape') $('.details.active').removeClass('active');
  });

  // Touch / swipe support
  let touchStartX = 0;
  const track = $('.slides-track')[0];
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const delta = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) goToSlide(index + (delta > 0 ? 1 : -1));
  });

  // Debounced resize
  let resizeTimer;
  $(window).on('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      const slideWidth = $('.slide').outerWidth(true);
      $('.slides-track').css('transform', `translateX(-${index * slideWidth}px)`);
    }, 100);
  });

  // Inject .bg divs
  $(".slide, .container").each(function () {
    $(this).prepend('<div class="bg"></div>');
  });

  // Click to show details
  $(".slide").click(function () {
    const details = $(this).find(".details");
    const isOpen = details.hasClass("active");
    $(".details").removeClass("active");
    if (!isOpen) details.addClass("active");
  });

  $(".details").click(function (e) {
    e.stopPropagation();
    $(this).removeClass("active");
  });

  // Initial button state
  $('.prev').addClass('disabled');
});