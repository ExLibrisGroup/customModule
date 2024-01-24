export function add(a: number, b: number): number {
  return a + b;
}

export function subtract(a: number, b: number): number {
  return a - b;
}


export function getTitle(): string {
  return 'Working with remote module';
}


export function changeRecomendation(){
  const h1 = document.createElement('h1');
  h1.innerHTML = 'Webpack is awesome. This is change recommendation page from yellow package';
  const comp = document.getElementsByTagName('nde-search-results-recommendations');

  comp.item(0)!.innerHTML = 'I get it from remote yellow package!!!!';

}
