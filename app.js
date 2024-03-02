const DECISION_THRESHOLD = 75

let isAnimating = false
let pullDeltaX = 0

function startDrag(event) {
    if (isAnimating) return
    const actualCard = event.target.closest('article')
    if (!actualCard) return
    const startX = event.pageX ?? event.touches[0].pageX

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onEnd)
    document.addEventListener('touchmove', onMove, { passive: true })
    document.addEventListener('touchend', onEnd, { passive: true })

    function onMove(event) {
        const currentX = event.pageX ?? event.touches[0].pageX
        pullDeltaX = currentX - startX
    
        if (pullDeltaX === 0) return

        isAnimating = true
        const deg = pullDeltaX / 14
        actualCard.style.transform = `translateX(${pullDeltaX}px) rotate(${deg}deg)`
        actualCard.style.cursor = 'grabbing'

        const opacity = Math.abs(pullDeltaX) / 100
        const isRight = pullDeltaX > 0
        
        const choiceElement =  isRight ? actualCard.querySelector('.choice.like') :  actualCard.querySelector('.choice.nope')
        choiceElement.style.opacity = opacity
    }

    function onEnd(event) {
        document.removeEventListener('mousemove', onMove)
        document.removeEventListener('mouseup', onEnd)
        document.removeEventListener('touchmove', onMove)
        document.removeEventListener('touchend', onEnd)

        const decisionMade = Math.abs(pullDeltaX) >= DECISION_THRESHOLD

        if (decisionMade) {
            const goRight = pullDeltaX >= 0
            const goLeft = !goRight

            actualCard.classList.add(goRight ? 'go-right' : 'go-left')
            actualCard.addEventListener('transitionend', () => {
                actualCard.remove()
            })
        } else {
            actualCard.classList.add('reset')
            actualCard.classList.remove('go-right', 'go-left')
            actualCard.querySelectorAll('.choice').forEach(element => {
                element.style.opacity = 0
            })
        }
        actualCard.addEventListener('transitionend', () => {
            actualCard.removeAttribute('style')
            actualCard.classList.remove('reset')
            pullDeltaX = 0
            isAnimating = false
        })
    }
}

document.addEventListener('mousedown', startDrag)
document.addEventListener('touchstart', startDrag, { passive: true })

const favButton = document.querySelector('.is-fav')
favButton.addEventListener('click', () => {
    simulateDecision(true)
})

const crossButton = document.querySelector('.is-cross')
crossButton.addEventListener('click', () => {
    simulateDecision(false)
})

function simulateDecision(goRight) {
    const cards = document.querySelectorAll('article')
    const actualCard = cards[cards.length - 1]

    actualCard.classList.add(goRight ? 'go-right' : 'go-left')

    const choiceElement = goRight ? actualCard.querySelector('.choice.like') : actualCard.querySelector('.choice.nope')
    choiceElement.style.opacity = 1

    actualCard.addEventListener('transitionend', () => {
        actualCard.remove()
    })
}