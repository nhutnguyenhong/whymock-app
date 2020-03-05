const tips = [
'Hey, why mock?',
'fixedDelayMilliseconds can delay the response :)',
'Url pattern /a\\?.* can help solve something :)',
'Context can help you work independency',
'Can export all your mock data to files',
'Boring with light? Change to dark mode!',
'Enable/Disable mocking for easy switching',
'Upload your mocking files so easy than ever before',
'Hey, Just search something',
'Boring with JSON color? Change it!',
'Expand layout for more space',
'Collapse layout for fun',
'Tired real API issue, let mock!',
'Refresh mocking engine by clicking on top right button',
'Copy CURL for using later',
'Duplidate mocking things for alternative cases',
'Share mocking things to another context',
'Boring with your context, Jump to another one',
'Hacking WhyMock? OK, I am fine!',
];

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
const getRandomInt = (minimum, maximum) => {
    return Math.floor(Math.random() * (maximum - minimum)) + minimum;
}

export const getTip = ()=>{
    const i = getRandomInt(0,tips.length);
    console.log('sax',i);
    return tips[i];
}