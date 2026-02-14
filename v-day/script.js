const gifStages = [
    "https://media.tenor.com/EBV7OT7ACfwAAAAj/u-u-qua-qua-u-quaa.gif",    // 0 normal
    "https://media1.tenor.com/m/uDugCXK4vI4AAAAd/chiikawa-hachiware.gif",  // 1 confused
    "https://media.tenor.com/f_rkpJbH1s8AAAAj/somsom1012.gif",             // 2 pleading
    "https://media.tenor.com/OGY9zdREsVAAAAAj/somsom1012.gif",             // 3 sad
    "https://media1.tenor.com/m/WGfra-Y_Ke0AAAAd/chiikawa-sad.gif",       // 4 sadder
    "https://media.tenor.com/CivArbX7NzQAAAAj/somsom1012.gif",             // 5 devastated
    "https://media.tenor.com/5_tv1HquZlcAAAAj/chiikawa.gif",               // 6 very devastated
    "https://media1.tenor.com/m/uDugCXK4vI4AAAAC/chiikawa-hachiware.gif"  // 7 crying runaway
]

const noMessages = [
    "No",
    "Are you positive? 🤔",
    "Pookie please... 🥺",
    "If you say no, I will be really sad...",
    "I will be very sad... 😢",
    "Don't do this to me...",
    "Last chance! 😭",
    "You can't catch me anyway 😜"
]

const yesTeasePokes = [
    "try saying no first... I bet you want to know what happens 😏",
    "click no, I dare you 😏"
]

let yesTeasedCount = 0

let noClickCount = 0
let runawayEnabled = false
let musicPlaying = true
let allowClick = false

const catGif = document.getElementById('cat-gif')
const yesBtn = document.getElementById('yes-btn')
const noBtn = document.getElementById('no-btn')
const music = document.getElementById('bg-music')

// Autoplay: audio starts muted (bypasses browser policy), unmute immediately
window.addEventListener('load', () => {
    music.muted = true
    music.volume = 0.3
    music.play().then(() => {
        music.muted = false
    }).catch(() => {
        // Fallback: unmute on first interaction
        document.addEventListener('click', () => {
            music.muted = false
            music.play().catch(() => {})
        }, { once: true })
    })
})

function toggleMusic() {
    if (musicPlaying) {
        music.pause()
        musicPlaying = false
        document.getElementById('music-toggle').textContent = '🔇'
    } else {
        music.muted = false
        music.play()
        musicPlaying = true
        document.getElementById('music-toggle').textContent = '🔊'
    }
}

function handleYesClick() {
    if (!allowClick) {
        // Tease her to try No first
        const msg = yesTeasePokes[Math.min(yesTeasedCount, yesTeasePokes.length - 1)]
        yesTeasedCount++
        showTeaseMessage(msg)
        return
    }
    window.location.href = 'yes.html'
}

function showTeaseMessage(msg) {
    let toast = document.getElementById('tease-toast')
    toast.textContent = msg
    toast.classList.add('show')
    clearTimeout(toast._timer)
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2500)
}

function handleNoClick() {
    if (runawayEnabled) {
        runAway()
        return
    }

    noClickCount++

    // Cycle through guilt-trip messages
    const msgIndex = Math.min(noClickCount, noMessages.length - 1)
    noBtn.textContent = noMessages[msgIndex]

    // Grow the Yes button bigger each time
    const currentSize = parseFloat(window.getComputedStyle(yesBtn).fontSize)
    
    // Mobile check (simple width check)
    const isMobile = window.innerWidth < 768
    const maxFontSize = isMobile ? 40 : 150 // Cap at 40px on mobile, 150px on desktop
    const growthRate = isMobile ? 1.15 : 1.35 // Slower growth on mobile

    const newSize = Math.min(currentSize * growthRate, maxFontSize)
    yesBtn.style.fontSize = `${newSize}px`
    
    // Adjust padding growth
    const currentPadY = parseFloat(window.getComputedStyle(yesBtn).paddingTop)
    const currentPadX = parseFloat(window.getComputedStyle(yesBtn).paddingRight)
    
    const maxPadY = isMobile ? 30 : 100
    const maxPadX = isMobile ? 60 : 200
    
    const newPadY = Math.min(currentPadY * 1.1, maxPadY)
    const newPadX = Math.min(currentPadX * 1.1, maxPadX)

    yesBtn.style.padding = `${newPadY}px ${newPadX}px`

    // Shrink No button to contrast
    if (noClickCount >= 2) {
        const noSize = parseFloat(window.getComputedStyle(noBtn).fontSize)
        noBtn.style.fontSize = `${Math.max(noSize * 0.85, 10)}px`
    }

    // Swap cat GIF through stages
    const gifIndex = Math.min(noClickCount, gifStages.length - 1)
    swapGif(gifStages[gifIndex])

    if(noClickCount >= 2 && !allowClick){
        allowClick = true
    }

    // Runaway starts at click 3
    if (noClickCount >= 3 && !runawayEnabled) {
        enableRunaway()
        runawayEnabled = true
    }
}

function swapGif(src) {
    catGif.style.opacity = '0'
    setTimeout(() => {
        catGif.src = src
        catGif.style.opacity = '1'
    }, 200)
}

function enableRunaway() {
    noBtn.addEventListener('mouseover', runAway)
    noBtn.addEventListener('touchstart', runAway, { passive: true })
    noBtn.addEventListener('mousedown', runAway) // Run away on click press
    noBtn.addEventListener('click', runAway)     // Backup run away on click
}

function runAway() {
    const margin = 50 // Increased safety margin
    const btnW = noBtn.offsetWidth
    const btnH = noBtn.offsetHeight
    const maxX = window.innerWidth - btnW - margin
    const maxY = window.innerHeight - btnH - margin

    // Ensure we don't get negative values if button is huge (unlikely for No btn but safe)
    const safeMaxX = Math.max(0, maxX)
    const safeMaxY = Math.max(0, maxY)

    const randomX = Math.random() * safeMaxX + margin / 2
    const randomY = Math.random() * safeMaxY + margin / 2

    noBtn.style.position = 'fixed'
    noBtn.style.left = `${randomX}px`
    noBtn.style.top = `${randomY}px`
    noBtn.style.zIndex = '50'
}
