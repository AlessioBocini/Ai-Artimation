
/**
 * PaintManager is the class in charge of storing and keeping information of all paintings
*/
class PaintManager{
    constructor(){
        this.map = new Map();
    }
    get(key){
        return this.map.get(key);
    }
    set(key,value){
        if(!this.map.has(key))
            this.map.set(key,value);
    }
    display(){
        for(let [niq, painting] of this.map){
            console.log(painting.name+" "+painting.artist)
        }
    }
    getIdByPosition(position){
        let count = 0;
        for(let [id,p] of this.map){
            if(count == position)
                return id;
            count++;
        }
        return undefined;
    }
    getIdByDescription(description){
        for(let [id,p] of this.map){
            if(p.description == description)
                return id;
        }
        return -1;
    }
}
/**
 *  Couple Manager is the class in charge of managing and storing each recognised pair of paintings.
 */
class CoupleManager{
    
    constructor(){
        this.couples = [];
    }
    clear(){
        while(this.couples.length>0)
            this.couples.pop();
    }
    push(couple){
        this.couples.push(couple);
    }

    findCouple(coupleToFind){
        return this.findCouple(coupleToFind.idpaint1,coupleToFind.idpaint2);
    }
    findCouple(id1, id2){
        var found = false;
        
        for(let i =0;i<this.couples.length;i++){
            var couple = this.couples[i];
            if( id1 == couple.idpaint1 && id2 == couple.idpaint2){
                found = true;
            }
            if(id1 == couple.idpaint2 && id2 == couple.idpaint1){
                found = true;
            }
            if(found) break;
        }
        return found;
    }

    getkeyword(couple){
        var id1 = couple.idpaint1;
        var id2 = couple.idpaint2;
        return getkeyword(id1,id2);
    }

    getkeyword(ido1,ido2){
        
        for(let i = 0; i< this.couples.length;i++){
            var id1 = this.couples[i].idpaint1;
            var id2 = this.couples[i].idpaint2;
            var keyword = this.couples[i].keyword;

            if(id1 == ido1 && id2 == ido2){
                return keyword;
            }
            if(id1 == ido2 && id2 == ido1){
                return keyword;
            }
        }
        return undefined;
    }
}
var coupleManager = new CoupleManager();
/**
 * Couple is the class that acts as a pair.
 */
class Couple{
    constructor(paint1,paint2,key, simil){
        this.keyword = key;
        this.idpaint1 = paint1;
        this.idpaint2 = paint2;
        this.similarity = simil
    }
}
var paintManager = new PaintManager();

/**
 * Painting is the class used to give a structure to paintings
*/
class Painting{
    constructor(id, name,artist,description,tag,image = undefined){
        this.name = name;
        this.artist = artist;
        this.description = description;
        this.image = image;
        this.id = id;
        this.tags = tag;
    }
    getId(){
        return this.id;
    }
}

/**
* This is the function in charge of gathering all the information of a selected pair and showing the description of that one.
*/
var gatherinfo = function(input_element){
    try{
        var keyword_container = input_element.parentNode;
        if(!keyword_container) 
            throw "keyword_container/gatherinfo";

        //  We are sure there is at least 1 element since we clicked on it
        //  We are sure that if there is an element there is a keyword to identify a type
        var keyword = keyword_container.getElementsByTagName("label")[0].innerHTML;
        if(!keyword) 
            throw "keyword/gatherinfo";

        var keyword_words = keyword.replace("Keyword","");
        keyword_words = keyword_words.split(",");
        var pairs = keyword_container.parentNode.getElementsByClassName("painting_info");
        if(!pairs) 
            throw "pairs/gatherinfo";
        //  We are sure there are 2 paintings
        var painting_1 = pairs[0];
        var painting_2 = pairs[1];
        if(!painting_1) 
            throw "painting_1/gatherinfo";
        if(!painting_2) 
            throw "painting_2/gatherinfo";

        var text_area_p1 = painting_1.getElementsByClassName("list-item-text-container")
        var text_area_p2 = painting_2.getElementsByClassName("list-item-text-container")
        if(!text_area_p1) 
            throw "text_area_p1/gatherinfo";
        if(!text_area_p2) 
            throw "text_area_p2/gatherinfo"; 

        var identifier_1 = text_area_p1[0].getElementsByTagName("label");
        var identifier_2 = text_area_p2[0].getElementsByTagName("label");
        if(!identifier_1)   
            throw "identifier_1/gatherinfo";
        if(!identifier_2)   
            throw "identifier_2/gatherinfo";

        
        var artistname1 = identifier_1[0].innerHTML;
        var paintingname_1 = identifier_1[1].innerHTML;
        var artistname2 = identifier_2[0].innerHTML;
        var paintingname_2 = identifier_2[1].innerHTML;

        if(artistname1.toLowerCase() === artistname2.toLowerCase() && paintingname_1.toLowerCase() === paintingname_2.toLowerCase()) 
            throw "painting_1 identifier is equal to painting_2 identifier";

        var id_1 = painting_1.getElementsByClassName("id-painting");
        var id_2 = painting_2.getElementsByClassName("id-painting");
        if(!id_1)
            throw "id-painting/gatherinfo";
        if(!id_2)
            throw "id-painting/gatherinfo";
        var id1 = id_1[0].innerHTML;
        var id2 = id_2[0].innerHTML;
        
        var similarity_label = keyword_container.parentNode.getElementsByClassName("similarity");
        var similarity = similarity_label[0].innerHTML;
        SetInfo(id1,id2,similarity,keyword_words)

        var search_bar = document.getElementById("search-bar");
        var style = getStyle(search_bar,"display");
        if(style == "none") toggle_visibility(false)
        else toggle_visibility()
        
    }
    catch(err){
        return console.error("ERROR - "+err);
    }
}

/**
 * SETINFO is a function dedicated on overwriting the selected pair boxes with the new information of the new pair we selected and that we want to display
*/
var SetInfo = function(id1,id2,similarity,keyword_words){
    var getInfoMap = (id) =>{
        var paint = paintManager.get(id);
        var artistname = paint.artist;
        var paintingname = paint.name;
        var description = paint.description;
        var image = paint.image;
        return [artistname, paintingname, description, image];
    }

    try{


        var [author1, paint1, description1, imageroot1] = getInfoMap(id1)

        var [author2, paint2, description2, imageroot2] = getInfoMap(id2)
        var painting_html1 = document.getElementsByClassName("selected-paint1");

        for(let key of keyword_words){

            key = key.replaceAll(" ","")
            key = key.replaceAll("\r","")
            var keyword = key+"";
            var diff_keyword = keyword.charAt(0).toUpperCase() + keyword.slice(1);
            description1 = description1.replaceAll(`${keyword}`,`<span class="highlighted_words">${keyword}</span>`);
            description2 = description2.replaceAll(`${keyword}`,`<span class="highlighted_words">${keyword}</span>`);
            description1 = description1.replaceAll(`${diff_keyword}`,`<span class="highlighted_words">${keyword}</span>`);
            description2 = description2.replaceAll(`${diff_keyword}`,`<span class="highlighted_words">${keyword}</span>`);
        }

        var label_score = document.getElementById("selected-pair-score");
        if(label_score){
            label_score.innerHTML = `The Selected pair has a similarity value of : <strong>${similarity.replace("Similarity : ","")}</strong>`
        }

        var labels1 = painting_html1[0].getElementsByTagName("label")
        if(labels1.length>2 || labels1.length<0) 
            throw "labels1 has an illegal length";
        labels1[0].innerHTML = author1;
        labels1[1].innerHTML = paint1;
        var __painting_description_html1 = painting_html1[0].getElementsByClassName("selected-img-text");
        if(!__painting_description_html1)
            throw "impossible to retrieve text_container of first painting";
        var painting_description1 = __painting_description_html1[0].getElementsByTagName("p");
        if(!painting_description1)
            throw "impossible to retrieve text of first painting";

        
        painting_description1[0].innerHTML = description1;
    
        var img_container_1 = painting_html1[0].getElementsByClassName("selected-img-container");
        var img_1 = img_container_1[0].getElementsByTagName("img");
        img_1[0].src = "./img/"+imageroot1;
        
    
    
        var painting_html2 = document.getElementsByClassName("selected-paint2");
        var labels2 = painting_html2[0].getElementsByTagName("label")
        if(labels2.length>2 || labels2.length<0) 
            throw "labels1 has an illegal length";
        labels2[0].innerHTML = author2;
        labels2[1].innerHTML = paint2;
        var __painting_description_html2 = painting_html2[0].getElementsByClassName("selected-img-text");
        if(!__painting_description_html2)
            throw "impossible to retrieve text first painting"
        var painting_description2 = __painting_description_html2[0].getElementsByTagName("p");
        if(!painting_description2)
            throw "impossible to retrieve text of first painting";

        painting_description2[0].innerHTML = description2;

        var img_container_2 = painting_html2[0].getElementsByClassName("selected-img-container");
        var img_2 = img_container_2[0].getElementsByTagName("img");
        img_2[0].src = "./img/"+imageroot2;
    }catch(err){
        console.error(`ERROR - ${err}`)
    }
    
}


/**
 * toggle_reset_button is a function needed to toggle the visibility of the Reset button
 */
var toggle_reset_button = function(){
    var button = document.getElementById("button_reset_id");
    var insertButton = document.getElementById("insert-painting");

    if(!button) return 1;
    var style = getStyle(button,"display");
    if(!style) return 1;
    
    if(style === "none") button.style.display = "block", insertButton.style.display = "none";
    else button.style.display = "none", insertButton.style.display = "inline-block";

    return 0;
}
/**
 * Function that takes an element and the name of a style to check if the element has that specific style or not.
 */
var getStyle = function(element,name){
    return element.currentStyle ? element.currentStyle[name] : window.getComputedStyle ? window.getComputedStyle(element, null).getPropertyValue(name) : null;
}


/**
 * This is the function that calculates the similarities among all possible pairs and adds in the PairManager each pair that satisfies a specified tolerance.
 * 
 * @param {*} sentences 
 * @param {*} tags 
 */
function similardescr(sentences,tags){
    function dot(a,b){
        const result = a.reduce((acc, cur, index)=>{
            acc += (cur * b[index]);
            return acc;
        }, 0);
        return result;
    }
    use.load().then(model => { // load the value of similarity by text.
        model.embed(sentences).then(embeddings => {
            var data_sentences = embeddings.arraySync(); // save the matrix of values of similarity by text.
            use.load().then(model2 =>{ // load the value of similarity by tags.
                model2.embed(tags).then(embeddings2 =>{ 
                    var data_tags = embeddings2.arraySync(); // save the matrix of values of similarity by tags.
                    coupleManager.clear();
                    for(let i =0;i<data_sentences.length;i++){
                        for(let k=0; k < i; k++){
                            var res_sentences = dot(data_sentences[i],data_sentences[k]); //matrix multiplication to get the similarity by text between work i and k
                            var res_tags = dot(data_tags[i],data_tags[k]) //matrix multiplication to get the similarity by tags between work i and k
                            var similarity_sentences = Math.round(res_sentences*100); // turned into %
                            var similarity_tags = Math.round(res_tags*100); // turned into %

                            var id_paint1 = paintManager.getIdByPosition(i); //get the actual i-painting. 
                            var id_paint2 = paintManager.getIdByPosition(k);//get the actual k-painting.

                            var similarity = (similarity_tags*3+similarity_sentences)/4; //calculate the actual value of similarity by doing a weight avg.
                            similarity = similarity.toFixed(2);
                            if(similarity >=70){ // insert in the list of pairs.
                                if(!coupleManager.findCouple(id_paint1,id_paint2)){

                                    var keywords = "";
                                    var specific_tags_first = tags[i].split("\n");
                                    var specific_tags_second = tags[k].split("\n");

                                    var tagSetter = new Map();
                                    for(let i = 0; i < specific_tags_first.length; i++){
                                        specific_tags_first[i] = specific_tags_first[i].replace("\r","");
                                        if(specific_tags_first[i]){
                                            tagSetter.set(specific_tags_first[i],true);
                                        }
                                    }
                                    
                                    for(let i = 0, k = 0; i < specific_tags_second.length; i++){
                                        specific_tags_second[i] = specific_tags_second[i].replace("\r","");

                                        if(specific_tags_second[i]){
                                            
                                            if(tagSetter.get(specific_tags_second[i])){
                                                if(++k >= 5){
                                                    keywords += specific_tags_second[i].toLowerCase()+",<br>";
                                                    k=0;
                                                }
                                                else keywords += specific_tags_second[i].toLowerCase()+", ";
                                            }
                                        }
                                    }

                                    keywords = keywords.substring(0,keywords.length-2);
                                    if(keywords.length>0){
                                        coupleManager.push(new Couple(id_paint1,id_paint2,keywords,similarity));
                                    }
                                        
                                }
                            }
                        }
                    }
                    displayList();
                })
            })
        });
    });
}

/**
 * Function built to extract tags 
 * @param {string : text}
**/
function extractTagsByText(text){
    text = text.toLowerCase();
    var list = []
    var final_text = "";
    var map_tags = new Map(); // < possible_tag , occurrence >

    var remove_punctuation_marks = (text)=>{
        text = text.replaceAll("\’s","")
        text = text.replaceAll("\'s","")
        text = text.replaceAll("\’d","")
        text = text.replaceAll("\'d","")
        text = text.replaceAll("\""," ")
        text = text.replaceAll("."," ")
        text = text.replaceAll(","," ")
        text = text.replaceAll(":"," ")
        text = text.replaceAll(";"," ")
        text = text.replaceAll("\'"," ")

        text = text.replaceAll("\n"," ")
        text = text.replaceAll("\r"," ")
        return text
    } // function to remove stop words from the text

    text = remove_punctuation_marks(text);
    list = text.split(" ");
    
    for( let word of list ){ // insert all in map
        if(word && isNaN(word)){
            if(map_tags.has(word)){
                //increment occurrence
                var value = map_tags.get(word);
                map_tags.set(word,++value);
            }else map_tags.set(word,1);
        }
    }
    var map_tagsSorted = new Map([...map_tags.entries()].sort((a,b) => b[1] - a[1]));

    var limit = 15;
    var map_to_sort_length = new Map();
    map_tagsSorted.forEach( ( occ,key) =>{
        if(limit > 0) {
            // Checking if the current tag is indeed a valid option
            if(check_valid(key)){
                map_to_sort_length.set(key,key)
                limit--;
            }
        }
    })

    var mapSortByLength = new Map([...map_to_sort_length.entries()].sort((a,b)=>b[1].length - a[1].length));
    mapSortByLength.forEach(word => {
        final_text+=`${word}\n`;
    })
    mapSortByLength.clear()
    map_tagsSorted.clear();
    map_tags.clear();
    return final_text;
}


/**
 * Check Validity of word in the list of tags
*/
var check_valid = (word) =>{
    var valid = true;
    switch(word){
        case "sign":
        case "signed":
        case "signing":
        case "signs":
        case "cut":
        case "cutting":
        case "cuts":
        case "dedicate":
        case "dedicating":
        case "dedicated":
        case "dedicates":
        case "between":
        case "included":
        case "includes":
        case "including":
        case "include":
        case "bunch":
        case "formed":
        case "forming":
        case "appear":
        case "appeared":
        case "appears":
        case "appearing":
        case "engage":
        case "engages":
        case "engaged":
        case "engaging":
        case "whirl":
        case "whirls":
        case "whirling":
        case "places":
        case "placing":
        case "placed":
        case "through":
        case "cancel":
        case "cancels":
        case "cancelled":
        case "cancelling":
        case "dances":
        case "danced":
        case "dancing":
        case "combine":
        case "combines":
        case "combined":
        case "combining":
        case "base":
        case "basing":
        case "based":
        case "under":
        case "just":
        case "instead":
        case "immediately":
        case "now":
        case "finish":
        case "finishes":
        case "finished":
        case "finishing":
        case "occupy":
        case "occupies":
        case "occupied":
        case "occupying":
        case "catch":
        case "catches":
        case "catched":
        case "catching":
        case "caught":
        case "four":
        case "five":
        case "background":
        case "part":
        case "front":
        case "stage":
        case "donna":
        case "lose":
        case "loses":
        case "losing":
        case "lost":
        case "art":
        case "love":
        case "loves":
        case "loving":
        case "loved":
        case "distort":
        case "distorting":
        case "distorts":
        case "distorted":
        case "discomforted":
        case "discomfort":
        case "discomforting":
        case "discomforts":
        case "points":
        case "point":
        case "pointing":
        case "pointed":
        case "moment":
        case "les":
        case "con":
        case "center":
        case "middle":
        case "set":
        case "sets":
        case "setting":
        case "liquefy":
        case "liquefying":
        case "liquefied":
        case "liquefies":
        case "follow":
        case "follows":
        case "following":
        case "followed":
        case "generate":
        case "generated":
        case "generating":
        case "generates":
        case "canvas":
        case "admire":
        case "admires":
        case "admiring":
        case "admired":
        case "double":
        case "new":
        case "exhibit":
        case "exhibits":
        case "exhibited":
        case "exhibiting":
        case "le":
        case "veil":
        case "veiling":
        case "veils":
        case "veiled":
        case "shape":
        case "shapes":
        case "shaping":
        case "shaped":
        case "create":
        case "creates":
        case "creating":
        case "created":
        case "move":
        case "moves":
        case "moving":
        case "moving":
        case "pro":
        case "procreate":
        case "procreating":
        case "procreated":
        case "procreates":
        case "care":
        case "cares":
        case "caring":
        case "cared":
        case "float":
        case "floats":
        case "floated":
        case "floating":
        case "take":
        case "takes":
        case "taking":
        case "took":
        case "taken":
        case "pose":
        case "poses":
        case "posing":
        case "posed":
        case "open":
        case "opens":
        case "opened":
        case "opening":
        case "picture":
        case "pictures":
        case "il":
        case "poor":
        case "poors":
        case "rich":
        case "riches":
        case "decorate":
        case "decorates":
        case "decorating":
        case "decorated":
        case "overlap":
        case "overlapping":
        case "overlaps":
        case "overlapped":
        case "empty":
        case "full":
        case "emerge":
        case "emerges":
        case "emerged":
        case "emerging":
        case "depict":
        case "depicted":
        case "depicts":
        case "depicting":
        case "struggle":
        case "struggles":
        case "struggling":
        case "struggled":
        case "inspire":
        case "inspires":
        case "inspiring":
        case "inspired":
        case "before":
        case "after":
        case "afterwards":
        case "deform":
        case "derforming":
        case "define":
        case "defined":
        case "defines":
        case "defining":
        case "allow":
        case "allows":
        case "allowing":
        case "allowed":
        case "recall":
        case "recalling":
        case "recalls":
        case "recalled":
        case "publish":
        case "publishes":
        case "published":
        case "publishing":
        case "write":
        case "writes":
        case "writing":
        case "wrote":
        case "written":
        case "exist":
        case "exists":
        case "existing":
        case "existed":
        case "separate":
        case "separates":
        case "separated":
        case "separating":
        case "drawing":
        case "observe":
        case "observes":
        case "observing":
        case "observed":
        case "times":
        case "not":
        case "weak":
        case "strong":
        case "choose":
        case "chose":
        case "chosen":
        case "chooses":
        case "link":
        case "linking":
        case "links":
        case "linked":
        case "design":
        case "designing":
        case "designed":
        case "designs":
        case "kiss":
        case "kisses":
        case "kissed":
        case "kissing":
        case "typical":
        case "usual":
        case "recurrent":
        case "recurrently":
        case "usually":
        case "typically":
        case "ordinarly":
        case "above":
        case "below":
        case "beneath":
        case "paint":
        case "paints":
        case "painting":
        case "paintings":
        case "painted":
        case "outer":
        case "inner":
        case "along":
        case "model":
        case "modeled":
        case "modelling":
        case "models":
        case "cross":
        case "crossing":
        case "crossed":
        case "crosses":
        case "embrace":
        case "embraces":
        case "embraced":
        case "embracing":
        case "one":
        case "two":
        case "some":
        case "three":
        case "seem":
        case "seems":
        case "it's":
        case "become":
        case "becomes":
        case "change":
        case "changed":
        case "live":
        case "lived":
        case "express":
        case "expressing":
        case "expressed":
        case "expresses":
        case "need":
        case "needs":
        case "needed":
        case "needing":
        case "do":
        case "does":
        case "doing":
        case "did":
        case "done":
        case "fuse":
        case "fusing":
        case "fused":
        case "fuses":
        case "look":
        case "looks":
        case "looking":
        case "looked":
        case "embrace":
        case "embracing":
        case "embraced":
        case "embraces":
        case "different":
        case "feel":
        case "felt":
        case "feels":
        case "feeling":
        case "version":
        case "versions":
        case "graphic":
        case "graphics":
        case "lead":
        case "there":
        case "other":
        case "sit":
        case "sat":
        case "sits":
        case "sitting":
        case "leads":
        case "leaded":
        case "leading":
        case "little":
        case "much":
        case "many":
        case "simple":
        case "hard":
        case "easy":
        case "difficult":
        case "use":
        case "fulfill":
        case "fullfilled":
        case "would":
        case "could":
        case "can":
        case "represent":
        case "represents":
        case "representing":
        case "represented":
        case "present":
        case "presents":
        case "presenting":
        case "presented":
        case "object":
        case "objects":
        case "objecting":
        case "objected":
        case "uses":
        case "figure":
        case "figures":
        case "say":
        case "says":
        case "scene":
        case "century":
        case "sense":
        case "senses":
        case "sensing":
        case "sensed":
        case "commit":
        case "committing":
        case "commits":
        case "commited":
        case "committed":
        case "prepare":
        case "prepares":
        case "preparing":
        case "prepared":
        case "suicide":
        case "suicides":
        case "suiciding":
        case "suicided":
        case "thus":
        case "find":
        case "finds":
        case "found":
        case "drown":
        case "drowning":
        case "drowned":
        case "wrapped":
        case "wrap":
        case "wraps":
        case "wrapping":
        case "around":
        case "propose":
        case "proposing":
        case "proposes":
        case "proposed":
        case "symbolize":
        case "symbolizes":
        case "symbolizing":
        case "symbolized":
        case "therefore":
        case "perhaps":
        case "aswell":
        case "also":
        case "infact":
        case "big":
        case "great":
        case "small":
        case "minor":
        case "major":
        case "have":
        case "has":
        case "had":
        case "suffer":
        case "you":
        case "yours":
        case "we":
        case "our":
        case "rain":
        case "rains":
        case "rained":
        case "vanish":
        case "vanished":
        case "vanishes":
        case "vanishing":
        case "advert":
        case "advertisement":
        case "advertise":
        case "advertising":
        case "will":
        case "subject":
        case "may":
        case "draw":
        case "drawn":
        case "drew":
        case "know":
        case "knew":
        case "known":
        case "announce":
        case "announcement":
        case "announcing":
        case "interpretation":
        case "hot":
        case "warm":
        case "cold":
        case "right":
        case "left":
        case "rather":
        case "include":
        case "includes":
        case "visible":
        case "half":
        case "occupy":
        case "occupied":
        case "occupying":
        case "low":
        case "lower":
        case "very":
        case "repeat":
        case "repeated":
        case "repeating":
        case "repeatedly":
        case "all":
        case "almost":
        case "eventual":
        case "eventually":
        case "contact":
        case "make":
        case "making":
        case "made":
        case "makes":
        case "divide":
        case "divides":
        case "divided":
        case "dividing":
        case "shoot":
        case "shots":
        case "painter":
        case "artist":
        case "author":
        case "shoots":
        case "shooting":
        case "shot":
        case "merge":
        case "merges":
        case "merging":
        case "merged":
        case "everyday":
        case "cover":
        case "covers":
        case "covering":
        case "covered":
        case "dress":
        case "dresses":
        case "dressing":
        case "dressed":
        case "prevent":
        case "prevented":
        case "preventing":
        case "prevents":
        case "help":
        case "helped":
        case "read":
        case "only":
        case "us":
        case "they":
        case "their":
        case "them":
        case "his":
        case "her":
        case "its":
        case "he":
        case "him":
        case "marked":
        case "theme":
        case "leave":
        case "leaves":
        case "left":
        case "listen":
        case "listens":
        case "listening":
        case "listened":
        case "painting":
        case "work":
        case "paitings":
        case "works":
        case "she":
        case "it":
        case "last":
        case "first":
        case "second":
        case "third":
        case "central":
        case "year":
        case "years":
        case "appear":
        case "the":
        case "this":
        case "these":
        case "those":
        case "towards":
        case "that":
        case "any":
        case "anything":
        case "every":
        case "everything":
        case "up":
        case "down":
        case "in":
        case "on":
        case "to":
        case "into":
        case "with":
        case "without":
        case "onto":
        case "both":
        case "each":
        case "particular":
        case "specific":
        case "unique":
        case "see":
        case "sees":
        case "seeing":
        case "saw":
        case "show":
        case "shows":
        case "same":
        case "equal":
        case "seen":
        case "and":
        case "or":
        case "of":
        case "but":
        case "however":
        case "for":
        case "by":
        case "like":
        case "if":
        case "as":
        case "conceived":
        case "a":
        case "an":
        case "at":
        case "be":
        case "is":
        case "was":
        case "from":
        case "been":
        case "are":
        case "were":
        case "being":
        case "partly":
        case "own":
        case "owns":
        case "owned":
        case "hide":
        case "hid":
        case "hides":
        case "hidden":
        case "whose":
        case "who":
        case "whom":
        case "which":
        case "what":
        case "whatever":
        case "where":
        case "whenever":
        case "when":
        case "whenever":{
            valid = false;
        }
    }
    return valid;
}

/**
 * This is the function used to gather the collection of all paintings from the database and store these all in the PaintManager map.
 * This function also calls @function smilardescr to calculate all similarities among pairs provided. 
 */
function getData(){
    $.ajax({
        url: 'http://localhost/php-stuff/request_data1.php',            
        method: 'GET',
        type: 'json',
        data: {},
        crossDomain:true,
    }).done((dataJSON)=>{
        coupleManager.clear(); //empty the manager object of pairs.
        var data = JSON.parse(dataJSON); //extract the data obtained in json via get request.
        data.forEach((row)=>{
            var p1 = row;
            // extract tags from painting description
            var tag_painting = extractTagsByText(p1.descr);
            var painting = new Painting(p1.id,p1.nome,p1.artist,p1.descr,tag_painting,p1.image); // make a new painting object
            paintManager.set(painting.getId(),painting); // insert it into the manager object paintmanager.
        });

        // Deduction of tags


        var sentences = [];
        var tags = [];
        for(let [id,painting] of paintManager.map){
            sentences.push(painting.description); // push in the array each painting description.
            tags.push(painting.tags);// push in the array the tags of each painting.
        }
        similardescr(sentences,tags); // call similardescr function.

    }).fail((error)=>{
        console.error(error);
    })
}
/***
 * Functions loaded and called on refresh.
 */
 $(document).ready(function(){
    getData();
});


/**
 * This function serves the role of displaying the list of all pairs in coupleManager in the homepage.
 */
function displayList(){
    var listHtml = "";

    var couples = new Map([...coupleManager.couples.entries()].sort((a, b) => b[1].similarity - a[1].similarity));
    couples.forEach((couple)=>{
        var painting1 = paintManager.get(couple.idpaint1);
        var painting2 = paintManager.get(couple.idpaint2);
        var keyword = couple.keyword;
        var score = couple.similarity;

        var figure1 =`
        <figure class="painting_info">
            <div class="id-painting">${painting1.id}</div>
            <div class="list-item-image-container">
                <img src="./img/${painting1.image}" alt="#">
            </div>
            <div class="list-item-text-container">
                <label>${painting1.artist}</label><br><label>${painting1.name}</label>
            </div>
        </figure>`;
        var figure2 =`
        <figure class="painting_info">
            <div class="id-painting">${painting2.id}</div>
            <div class="list-item-image-container">
                <img src="./img/${painting2.image}" alt="#">
            </div>
            <div class="list-item-text-container">
                <label>${painting2.artist}</label><br><label>${painting2.name}</label>
            </div>
        </figure>`;
        var elem= `
        <th class="list-item">
            <div class="list-item-text">
                ${figure1}
                ${figure2}
            </div>
            <div>
                <label class ="similarity"> Similarity : ${score}%</label>
            </div>
            <div class="keyword-container">
                <label class="keyword">Keyword ${keyword}</label>
                <input type="button" value="Click to select" onclick="gatherinfo(this)"></button>
            </div>
        </th>`
        //TODO devo vincolare il fatto di al più 2 opere per riga
        listHtml+=elem;
    })
        var HTMLlistcontainer = document.getElementsByClassName("list");
        if(HTMLlistcontainer)
            HTMLlistcontainer[0].innerHTML = listHtml;

}


/**
 * This function is used to search a specific filter within all keywords and artist names in the list of pairs to reduce the length of the list.
 */
function search(){
    var list = document.getElementsByClassName("list")
    var filter = document.getElementById("search-bar");
    var filter_text = filter.value.toUpperCase();
    for(let i = 0; i< list[0].children.length;i++){ // for each pair
        var child = list[0].children[i];
        var keyword = child.getElementsByClassName("keyword");
        var keyword_text = keyword[0].innerHTML.toUpperCase();
        

        var paintings = child.getElementsByClassName("list-item-text-container");
        var artist1 = paintings[0].innerHTML.split("<br>")[0];
        var artist2 = paintings[1].innerHTML.split("<br>")[0];

        // remove <label></label> and eventual \n from artist 1
        artist1 = artist1.replace("<label>","");
        artist1 = artist1.replace("</label>","");
        while(artist1.includes(" ")){
            artist1 = artist1.replace(" ","");
        }
        while(artist1.includes("\n")){
            artist1 = artist1.replace("\n","");
        }
        
        // remove <label></label> and eventual \n from artist 2
        artist2 = artist2.replace("<label>","");
        artist2 = artist2.replace("</label>","");
        while(artist2.includes(" ")){
            artist2 = artist2.replace(" ","");
        }
        while(artist2.includes("\n")){
            artist2 = artist2.replace("\n","");
        }
        artist1 = artist1.toUpperCase();
        artist2 = artist2.toUpperCase();

        if(keyword_text.indexOf(filter_text) > -1) //check if the word may be contained in a tag
            child.style.display = "";
        else if(artist1.includes(filter_text) || artist2.includes(filter_text)) // check if the word is in the artist names
            child.style.display = "";
        else child.style.display = "none"; //otherwise just hide the pair
    }
}

/**
 * 
 *  Send Email Function
 */
 function submitemail(input){
    var subject = document.getElementById("inpemail");
    var content = document.getElementById("notesbox");
    var form = document.getElementById("contact_form");
    form.action = "mailto:alessio.bocini@stud.unifi.it";
    var text_content = content.value;
    var text_subject = subject.value;
    if(text_subject.length>0){
        var sub = `subject=${text_subject}`;
        
        form.action += '?'+sub;
    }
    if(text_content.length > 0){
        var cont = `body=${text_content}`;

        if(text_subject.length > 0) form.action += '&'+cont;
        else form.action += '?'+cont;
    }
    window.location = form.action;
}

/**
 * This function is used to hide the list of all pairs and only show the pair the user selected.
 */
var toggle_visibility = function(toggle_button = true){
    try{
        CancelInsert();
        var html_table_list = document.getElementById("table-list-id");
        var selected_container = document.getElementsByClassName("selected-pair-container");
        var selected_pair_page = document.getElementsByClassName("selected-pair-page")[0];
        var search_bar = document.getElementById("search-bar");
        var score_similarity = document.getElementById("selected-pair-score");

        if(!html_table_list)
            throw "can't retrieve table-list-id";

        if(!selected_container)
            throw "display the new selected container";
        if(!search_bar)
            throw "can't retrieve the search-bar";
        if(!score_similarity)
            throw "can't retrieve the selected-pair-score";
        
        var html_selected_container = selected_container[0];

        if(!html_selected_container)
        throw "html_selected_container";

        var style = getStyle(search_bar,"display");
        if(!style) 
            throw "getStyle function"

        if(style === "none"){
            //html_table_list.style.display = "inline-block";
            if(toggle_button){
                search_bar.style.display ="inline-block";
                html_selected_container.style.display = "none";
                score_similarity.style.display = "none";
                selected_pair_page.style.display = "none";
            }
        }else{
            //html_table_list.style.display = "none";
            search_bar.style.display = "none";
            score_similarity.style.display = "inline-flex";
            html_selected_container.style.display = "inline-flex";
            selected_pair_page.style.display = "inline-flex";
        }
        if(toggle_button)
            var res = toggle_reset_button();
        
        if(res == 1)
            throw "toggle_reset_button";

    }catch(err){
        console.error(`ERROR - ${err}`)
    }
}

/** SWAP PAGE FUNCTIONS begin */

function toggleOnIndex(){
    var navindex = document.getElementById("homepage");
    var navpdescr = document.getElementById("pdescription");
    var navcontacts = document.getElementById("contacts");

    var index_page = document.getElementById("index-page");
    index_page.style.display = "block";
    var contacts_page = document.getElementById("contacts-page");
    contacts_page.style.display = 'none';
    var description = document.getElementById("pdescription-page");
    description.style.display = 'none';
    if(!navindex.classList.contains('current'))
        navindex.classList.toggle('current');
    if(navpdescr.classList.contains('current'))
        navpdescr.classList.toggle('current');
    if(navcontacts.classList.contains('current'))
        navcontacts.classList.toggle('current');
}
function toggleOnContacts(){
    var navindex = document.getElementById("homepage");
    var navpdescr = document.getElementById("pdescription");
    var navcontacts = document.getElementById("contacts");

    var index_page = document.getElementById("index-page");
    index_page.style.display = "none";
    var contacts_page = document.getElementById("contacts-page");
    contacts_page.style.display = 'block';
    var description = document.getElementById("pdescription-page");
    description.style.display = 'none';
    if(navindex.classList.contains('current'))
        navindex.classList.toggle('current');
    if(navpdescr.classList.contains('current'))
        navpdescr.classList.toggle('current');
    if(!navcontacts.classList.contains('current'))
        navcontacts.classList.toggle('current');
}

function toggleOnDescription(){
    var navindex = document.getElementById("homepage");
    var navpdescr = document.getElementById("pdescription");
    var navcontacts = document.getElementById("contacts");

    var index_page = document.getElementById("index-page");
    index_page.style.display = "none";
    var contacts_page = document.getElementById("contacts-page");
    contacts_page.style.display = 'none';
    var description = document.getElementById("pdescription-page");
    description.style.display = 'block';
    if(navindex.classList.contains('current'))
        navindex.classList.toggle('current');
    if(!navpdescr.classList.contains('current'))
        navpdescr.classList.toggle('current');
    if(navcontacts.classList.contains('current'))
        navcontacts.classList.toggle('current');
}

/** SWAP PAGE FUNCTIONS end */

/** start insert-painting functions */
function displayInsert(){
    var container = document.getElementById("popup-insert");
    container.style.display = "block";
}
function CancelInsert(){
    var container = document.getElementById("popup-insert");
    container.reset();
    container.style.display = "none"
    
}
function SubmitInsertPainting(){
    var title = document.getElementById("title-insert-popup").value;
    var artist = document.getElementById("artist-insert-popup").value;
    var filesToUpload = document.getElementById("files-insert-popup").files;
    var descr = document.getElementById("textarea-insert-popup").value;
    if(filesToUpload.length > 1){
        return alert("You are allowed to insert only 1 painting at the time, please.");
    }
    var file = filesToUpload[0];
    if(!file){
        return alert("You need to insert one painting first, please.");
    }
    if(!file.type.match(/image.*/)){
        return alert("The file uploaded is not an image, retry please.");
    }
    CancelInsert();
    var data = {
        title : title,
        artist : artist,
        descr : descr,
        file: file.name
    }

    var jsonDATA = JSON.stringify(data);

    var formData = new FormData();
    formData.append("file",file);

    /**
     * we have file, artist, title,descr
    */
    /**
     * I upload the file
    */
    $.ajax({
        url: 'http://localhost/php-stuff/upload_painting.php',            
        method: 'POST',
        data: formData,
        crossDomain:true,
        processData : false,
        contentType: false,
        cache: false
    }).done((success)=>{
        if(success == 1){
            /* 
            * I upload the rest
            */
            $.ajax({
                url: 'http://localhost/php-stuff/insert_painting.php',            
                method: 'POST',
                data: data,
                crossDomain:true,
            }).done((id)=>{
                var opera_id = id;
                if(opera_id > -1){
                    AddPaintingToSimilarity(opera_id,data.title,data.artist,data.descr,data.file);
                }
                
            }).fail((error)=>{
                console.error(error);
            })
        }
    }).fail((error)=>{
        console.error(error);
    })
}

function AddPaintingToSimilarity(id,title,artist,descr,filename){
    
    var tag_painting = extractTagsByText(descr);
    // Deduction of tags
    id = id.replace("\n","");
    id = id.replace("\r","");
    var painting = new Painting(id,title,artist,descr,tag_painting,filename);
    paintManager.set(id,painting);

    var sentences = [];
    var tags = [];
    for(let [id,painting] of paintManager.map){
        sentences.push(painting.description); // push in the array each painting description.
        tags.push(painting.tags);// push in the array the tags of each painting.
    }
    
    similardescr(sentences,tags); // call similardescr function.
}
/** end insert-painting functions */