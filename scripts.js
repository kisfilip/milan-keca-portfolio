'use strict'

window.onload = function() {
  const siteWrapper = document.querySelector('.site-wrapper')

  const loadingSection = document.querySelector('.loading-section')
  const backgroundSection = document.querySelector('.background-section')

  const scrollDownSection = document.querySelector('.scroll-down-section')
  const scrollUpSection = document.querySelector('.scroll-up-section')
  const scrollSections = document.querySelectorAll('.scroll-section')

  const navLinks = document.querySelectorAll('.navigation-section > nav > ul > li')
  const downArrow = document.querySelector('.portfolio__down-arrow')

  const numOfPages = document.querySelectorAll('.scroll-section > .page').length / 2 - 1

  // The mobile url bar should be abolished
  // hence the following 2 lines fix
  // let documentHeight = getDocumentHeight()
  let documentHeight = getSiteWrapperHeight()
  let documentWidth = getDocumentWidth()
  let pageIndex = 0

  let wheelScrollTimeout
  let resizeTimeout
  let onLoadingCompleteTimeout

  let touchStartClientY
  let touchEndClientY
  let touchDeltaClientY

  const mainColors = ['#7cc6fe', '#5dfdcb', '#8789c0', '#f4faff']

  init()

  function init() {
    setInitialState()
    onLoadingComplete()
  }

  function setInitialState() {
    window.addEventListener('resize', handleWindowResize)
    window.addEventListener('keydown', handleKeyPress)
    window.addEventListener('touchstart', handleTouchStart)
    window.addEventListener('touchend', handleTouchEnd)
    scrollUpSection.style.transform = `translateY(-${numOfPages * documentHeight}px)`
    backgroundSection.style.background = mainColors[0]
    backgroundSection.style.transition = 'background 1s ease'

    navLinks.forEach(link => {
      link.addEventListener('click', handleNavClick)
    })

    downArrow.addEventListener('click', handleDownArrowClick)
  }

  function updateView() {
    //todo: Remove scroll event listeners here
    scrollDownSection.style.transform = `translateY(-${pageIndex * documentHeight}px)`
    scrollUpSection.style.transform = `translateY(${-(numOfPages * documentHeight) + (pageIndex * documentHeight)}px)`
    backgroundSection.style.background = mainColors[pageIndex]

    navLinks.forEach((navLink, i) => {
      navLink.classList.remove('active')
      if (i == pageIndex) {
        navLink.classList.add('active')
      }
    })
    //todo: Add scroll event listeners here
  }

  function setLoading() {
    loadingSection.classList.remove('loading-section--hidden', 'loading-section--removed')
    scrollSections.forEach(section => section.style.transition = '')

    // Remove scroll event listeners here
    document.removeEventListener('mousewheel', handleWheelScroll)
  }

  function onLoadingComplete() {
    loadingSection.classList.add('loading-section--hidden')

    clearTimeout(onLoadingCompleteTimeout)

    onLoadingCompleteTimeout = setTimeout(() => {
      loadingSection.classList.add('loading-section--removed')
      scrollSections.forEach(section => section.style.transition = '1s ease')

      // Add scroll event listeners here
      document.addEventListener('mousewheel', handleWheelScroll)
    }, 1000)
  }

  function handleWheelScroll(e) {
    if (e.wheelDelta < 0 && pageIndex < numOfPages) {
      pageIndex++
    } else if (e.wheelDelta > 0 && pageIndex > 0) {
      pageIndex--
    } else return

    updateView()

    document.removeEventListener('mousewheel', handleWheelScroll)

    wheelScrollTimeout = setTimeout(() => document.addEventListener('mousewheel', handleWheelScroll), 250)
  }

  function handleWindowResize() {
    if (documentWidth !== getDocumentWidth()) {
      documentWidth = getDocumentWidth()

      setLoading()

      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(debounceWindowResize, 250)
    }
  }

  function debounceWindowResize() {

    // Clear scroll timeouts here
    // in case a scroll happens right before a resize
    clearTimeout(wheelScrollTimeout)

    documentHeight = getSiteWrapperHeight()
    updateView()
    onLoadingComplete()
  }

  function handleNavClick(e) {
    pageIndex = e.target.dataset.id
    updateView()
  }

  function handleKeyPress(e) {
    if (e.keyCode === 40 && pageIndex < numOfPages) {
      pageIndex++
    } else if (e.keyCode === 38  && pageIndex > 0) {
      pageIndex--
    } else return

    updateView()
  }

  function handleTouchStart(e) {
    touchStartClientY = e.touches[0].clientY
  }

  function handleTouchEnd(e) {
    touchEndClientY = e.changedTouches[0].clientY
    touchDeltaClientY = touchStartClientY - touchEndClientY

    if (touchDeltaClientY > 20 && pageIndex < numOfPages) {
      pageIndex++
    } else if (touchDeltaClientY < -20 && pageIndex > 0) {
      pageIndex--
    } else return

    updateView()
  }

  function handleDownArrowClick() {
    pageIndex = 1
    updateView()
  }

  function getSiteWrapperHeight() {
    return siteWrapper.clientHeight
  }

  function getDocumentHeight() {
    return document.documentElement.clientHeight
  }

  function getDocumentWidth() {
    return document.documentElement.clientWidth
  }
}

