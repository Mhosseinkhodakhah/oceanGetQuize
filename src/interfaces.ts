export interface lessonDB {
    name: string,
    number: number,
    sublessons: {}[],
    reward: number,
    eName: string,
    aName: string,
    seen: string[],
    rewarded: boolean,
    paasedQuize: boolean,
    levels: any
}


export interface questionDB {
    questionForm : string,
    eQuestionForm : string,
    aQuestionForm : string,
    options : string[],
    eOptions : string[],
    aOptions : string[],
    trueOption: number,
    time: number,
    level: any,
    passedUser: string[]
}


export interface levelDB {
    number: number,
    rewarded: boolean,
    reward: number,
    lesson: any,
    passedUsers: string[],
    questions: any
}

export interface subLessonDB {

    name: string,
    eName: string,
    aName: string,
    number: number,
    lesson: any,
    content: {},
    seen: string[]
    subLessons : {eName : string , number : number , _id : any , content : any}[]
}


export interface content {
    internalContent: {},

    pictures?: string[],
    ePictures?: string[],
    aPictures?: string[],

    seen?: string[],

    subLesson: any
}


export interface responseInterface {

}