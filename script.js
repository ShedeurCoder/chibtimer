function id(id) {
    return document.getElementById(id)
}

if (localStorage.times) {
    localStorage.times.split(',').forEach(element => {
        createTimeListElement(element)
    });
}

// scramble code stolen from https://github.com/bjcarlson42/blog-post-sample-code/blob/master/Rubik's%20Cube%20JavaScript%20Scrambler/part_two.js
function makeScramble() {
    var options = ["F", "F2", "F'", "R", "R2", "R'", "U", "U2", "U'", "B", "B2", "B'", "L", "L2", "L'", "D", "D2", "D'"]
    var numOptions = [0, 1, 2, 3, 4, 5] // 0 = F, 1 = R, 2 = U, 3 = B, 4 = L, 5 = D
    var scramble = []
    var scrambleMoves = []
    var bad = true

    while (bad) {
        scramble = []
        for (var i = 0; i < 20; i++) {
            scramble.push(numOptions[getRandomInt(6)])
        }
        // check if moves directly next to each other involve the same letter
        for (var i = 0; i < 20 - 1; i++) {
            if (scramble[i] == scramble[i + 1]) {
                bad = true
                break
            } else {
                bad = false
            }
        }
    }
    // switch numbers to letters
    var move
    for (var i = 0; i < 20; i++) {
        switch (scramble[i]) {
            case 0:
                move = options[getRandomInt(3)] // 0,1,2
                scrambleMoves.push(move)
                break
            case 1:
                move = options[getRandomIntBetween(3, 6)] // 3,4,5
                scrambleMoves.push(move)
                break
            case 2:
                move = options[getRandomIntBetween(6, 9)] // 6,7,8
                scrambleMoves.push(move)
                break
            case 3:
                move = options[getRandomIntBetween(9, 12)] // 9,10,11
                scrambleMoves.push(move)
                break
            case 4:
                move = options[getRandomIntBetween(12, 15)] // 12,13,14
                scrambleMoves.push(move)
                break
            case 5:
                move = options[getRandomIntBetween(15, 18)] // 15,16,17
                scrambleMoves.push(move)
                break
        }
    }
    id('scramble').innerText = scrambleMoves
    id('scramble').innerText = id('scramble').innerText.replaceAll(',', ' ')
}
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max)) // returns up to max - 1
}
function getRandomIntBetween(min, max) { // return a number from min to max - 1. Ex. 3, 9 returns 3 - 8
    return Math.floor(Math.random() * (max - min) + min)
}
makeScramble()

document.addEventListener('keypress', (e) => {
    if (e.keyCode == 32) {
        e.preventDefault()
    }
})

// start timer
document.addEventListener('keyup', startTimer)

var timing = false
function startTimer(event) {
    if (event.keyCode == 32 && !timing) {
        event.preventDefault()
        setTimeout(() => {
            timing = true
        }, 1)
        let startingTime = Date.now()
        var timer = setInterval(() => {
            updateDisplay(Date.now() - startingTime)
        }, 10)
        document.addEventListener('keypress', () => {
            if (timing) {
                clearInterval(timer)
            }
        })
        document.addEventListener('keyup', () => {
            if (timing) {
                timing = false
                makeScramble()
                addTime()
            }
        })
    }
}
function updateDisplay(ms) {
    let seconds = Math.floor(ms / 1000)
    ms = ms - (seconds * 1000)
    if (ms < 10) {
        id('milliseconds').innerText = '00' + ms
    } else if (ms < 100) {
        id('milliseconds').innerText = '0' + ms
    } else {
        id('milliseconds').innerText = ms
    }
    if (seconds >= 60) {
        var minutes = Math.floor(seconds / 60)
        if (seconds - (minutes * 60) < 10) {
            seconds = minutes + ':0' + (seconds - (minutes * 60))
        } else {
            seconds = minutes + ':' + (seconds - (minutes * 60))
        }
    }
    id('seconds').innerText = seconds
}
function createTimeListElement(time) {
    if (time.includes('DNF'))
        time = 'DNF'

    const tr = document.createElement('tr')
    tr.setAttribute('class', 'time')

    const solveNum = document.createElement('td')
    solveNum.innerText = document.getElementsByClassName('time').length + 1

    const solveTime = document.createElement('td')
    solveTime.innerText = time
    solveTime.setAttribute('class', 'w-100')

    const plusTwo = document.createElement('button')
    plusTwo.setAttribute('onclick', `plusTwo(${solveNum.innerText - 1})`)
    plusTwo.setAttribute('class',  'float-right')
    plusTwo.innerText = '+2'

    const dnf = document.createElement('button')
    dnf.setAttribute('onclick', `dnf(${solveNum.innerText - 1})`)
    dnf.setAttribute('class',  'float-right')
    dnf.innerText = 'DNF'

    const deleteSolve = document.createElement('button')
    deleteSolve.setAttribute('onclick', `deleteSolve(${solveNum.innerText - 1})`)
    deleteSolve.setAttribute('class',  'float-right')
    deleteSolve.innerText = '×'

    tr.appendChild(solveNum)
    tr.appendChild(solveTime)

    solveTime.appendChild(deleteSolve)
    solveTime.appendChild(dnf)
    solveTime.appendChild(plusTwo)

    const newestTime = document.getElementsByClassName('time')[0]
    if (newestTime) {
        id('time-table').insertBefore(tr, newestTime);
    } else {
        id('time-table').appendChild(tr)
    }
}
function calculateAverage(times) {
    let totalTimes = 0
    times.forEach(element => {
        // if string
        if (isNaN(element*3)) {
            // if +2
            if (element.includes('+')) {
                element = element.replace('+', '')
            }
            // if in minutes
            if (element.includes(':')) {
                let minutes = element.split(':')
                let seconds = minutes[1]
                minutes = minutes[0]
                element = parseFloat(seconds) + parseInt(minutes * 60)
            }
        }
        let multiplied = element * 1000
        totalTimes += multiplied
    });
    // format to ss.ms
    let average = Math.round(totalTimes / parseInt(times.length))
    average /= 1000
    average = average.toFixed(3)
    let averageDisplay
    // if in minutes
    if (average >= 60) {
        let milliseconds = average.split('.')
        milliseconds = milliseconds[1]
        let seconds = Math.floor(average)
        let minutes = Math.floor(seconds / 60)
        // format to mm:ss.ms
        if (seconds - (minutes * 60) < 10) {
            let displaySeconds = seconds - (minutes * 60)
            averageDisplay = minutes + ':0' + displaySeconds + '.' + milliseconds
        } else {
            let displaySeconds = seconds - (minutes * 60)
            averageDisplay = minutes + ':' + displaySeconds + '.' + milliseconds
        }
    } else {
        averageDisplay = average
    }
    // log results to the screen
    if (isNaN(average)) {
        return 'DNF'
    } else {
        return averageDisplay
    }
}
function removeBestAndWorst(times) {
    let filteredTimes = []
    times.forEach((time) => {
        if (time.includes('+')) {
            time = time.replace('+', '')
        }
        if (time.includes(':')) {
            let minutes = time.split(':')
            let seconds = minutes[1]
            minutes = minutes[0]
            time = parseFloat(seconds) + parseInt(minutes * 60)
        }
        if (time.includes('DNF')) {
            time = 'DNF'
        }
        time = parseFloat(time)
        if (isNaN(time)) {
            time = 'DNF'
        }
        filteredTimes.push(time)
    });
    let sortedTimes = filteredTimes.sort((a, b) => {
        if (a < b || isNaN(b*3)) {
            return -1;
        }
        if (a > b || isNaN(a*3)) {
            return 1;
        }
        return 0;
    })
    finalTimes = sortedTimes.slice(1,-1)
    return finalTimes
}
function addTime() {
    const time = id('seconds').innerText + '.' + id('milliseconds').innerText
    if (localStorage.times) {
        let times = localStorage.times.split(',')
        times.push(time)
        localStorage.removeItem('times')
        localStorage.setItem('times', times)
    } else {
        localStorage.setItem('times', [time])
    }
    createTimeListElement(time)
    let times = localStorage.times.split(',')
    if (times.length >= 3) {
        id('mo3').innerText = calculateAverage(times.slice(-3))
    }
    if (times.length >= 5) {
        id('ao5').innerText = calculateAverage( removeBestAndWorst( times.slice(-5) ) )
    }
    if (times.length >= 12) {
        id('ao12').innerText = calculateAverage( removeBestAndWorst( times.slice(-12) ) )
    }
}
if (localStorage.times) {
    if (localStorage.times.split(',').length >= 3) {
        id('mo3').innerText = calculateAverage(localStorage.times.split(',').slice(-3))
    }
    if (localStorage.times.split(',').length >= 5) {
        id('ao5').innerText = calculateAverage( removeBestAndWorst( localStorage.times.split(',').slice(-5) ) )
    }
    if (localStorage.times.split(',').length >= 12) {
        id('ao12').innerText = calculateAverage( removeBestAndWorst( localStorage.times.split(',').slice(-12) ) )
    }
}
function plusTwo(index) {
    var times = localStorage.times.split(',')
    if (!times[index].includes('+')) {
        times[index] = parseFloat(parseFloat(times[index]) + 2).toFixed(3) + '+'
    } else {
        times[index] = (parseFloat(times[index].replace('+', '')) - 2).toFixed(3)
    }
    localStorage.times = [times]
    id('time-table').innerHTML = ''
    localStorage.times.split(',').forEach(element => {
        createTimeListElement(element)
    });
    if (localStorage.times.split(',').length >= 3) {
        id('mo3').innerText = calculateAverage(localStorage.times.split(',').slice(-3))
    }
    if (localStorage.times.split(',').length >= 5) {
        id('ao5').innerText = calculateAverage( removeBestAndWorst( localStorage.times.split(',').slice(-5) ) )
    }
    if (localStorage.times.split(',').length >= 12) {
        id('ao12').innerText = calculateAverage( removeBestAndWorst( localStorage.times.split(',').slice(-12) ) )
    }
}
function dnf(index) {
    var times = localStorage.times.split(',')
    if (!times[index].includes('DNF')) {
        times[index] += 'DNF'
    } else {
        times[index] = times[index].replace('DNF', '')
    }
    localStorage.times = [times]
    id('time-table').innerHTML = ''
    localStorage.times.split(',').forEach(element => {
        createTimeListElement(element)
    });
    if (localStorage.times.split(',').length >= 3) {
        id('mo3').innerText = calculateAverage(localStorage.times.split(',').slice(-3))
    }
    if (localStorage.times.split(',').length >= 5) {
        id('ao5').innerText = calculateAverage( removeBestAndWorst( localStorage.times.split(',').slice(-5) ) )
    }
    if (localStorage.times.split(',').length >= 12) {
        id('ao12').innerText = calculateAverage( removeBestAndWorst( localStorage.times.split(',').slice(-12) ) )
    }
}
function deleteSolve(index) {
    let deleteConfirm = confirm('Are you sure you want to permanently delete this solve?')
    if (!deleteConfirm) {
        return false
    }
    var times = localStorage.times.split(',')
    times.splice(index, 1)
    localStorage.times = times
    id('time-table').innerHTML = ''
    if (localStorage.times != '') {
        localStorage.times.split(',').forEach(element => {
            createTimeListElement(element)
        });
        if (localStorage.times.split(',').length >= 3) {
            id('mo3').innerText = calculateAverage(localStorage.times.split(',').slice(-3))
        }
        if (localStorage.times.split(',').length >= 5) {
            id('ao5').innerText = calculateAverage( removeBestAndWorst( localStorage.times.split(',').slice(-5) ) )
        }
        if (localStorage.times.split(',').length >= 12) {
            id('ao12').innerText = calculateAverage( removeBestAndWorst( localStorage.times.split(',').slice(-12) ) )
        }
    }
}
function deleteAll() {
    let deleteConfirm = confirm('Are you sure you want to delete all solves?')
    if (!deleteConfirm) {
        return false
    }
    localStorage.clear()
    id('time-table').innerHTML = ''
}
