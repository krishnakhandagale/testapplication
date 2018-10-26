export function sortArrayByProperty(array, property){
    if(!array){
        return [];
    }
    if(!array.length){
        return [];
    }
   return array.sort(function (a, b) {
       if(a.hasOwnProperty(property) && b.hasOwnProperty(property)){
           return a[property].toLowerCase().localeCompare(b[property].toLowerCase());
       }
    });
}
export function scrollToTop() {
    window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
    });
}