export function searchEmoji(state) {
    switch(state) {
        case 'Relaxat':
            return require('../assets/images/emoji_1.gif')
        case 'Meh':
            return require('../assets/images/emoji_26.gif')
        case 'Estressat':
            return require('../assets/images/emoji_27.gif')
    }
}

export function searchIcon(activity) {
    switch(activity) {
        case "Tasques":
            return 'md-list-box'
        case "Volum/ritme de treball":
            return 'md-hourglass'
        case "Horaris":
            return 'md-time'
        case "Participació/control":
            return 'md-chatbubbles'
        case "Perspectiva professional":
            return 'logo-euro'
        case "Paper en l'empresa":
            return 'md-person-add'
        case "Relacions interpersonals":
            return 'md-people'
        case "Cultura d'empresa":
            return 'md-business'
        case "Relació feina/familia":
            return 'md-home'
        case "Altres":
            return 'md-briefcase'
    }
}

export function searchAcronym(username) {
    let acronym = username.split(" ").reduce((response,word)=> response+=word.slice(0,1),'');
    let name = username.split(" ");
    if(name.length > 2) {
        let res = name[0] + " " + name[1];
        acronym = res.split(" ").reduce((response,word)=> response+=word.slice(0,1),'');
    }
    return acronym;
}