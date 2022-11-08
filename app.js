const cards=document.getElementById('cards')
const items=document.getElementById('items')
const footer=document.getElementById('footer')


const templateCard= document.getElementById('template-card').content
const templateFooter= document.getElementById('template-footer').content
const templateCarrito= document.getElementById('template-carrito').content

//utilizare el mismo fragment para todos 
const fragment=document.createDocumentFragment()
//creo un objeto para almacenar los elementos que capture
let carrito={}


document.addEventListener('DOMContentLoaded',() => {
    fetchData()
    if(localStorage.getItem('carrito')){
        carrito=JSON.parse(localStorage.getItem('carrito'))
        pintarCarrito()
    }
})
cards.addEventListener('click',(e)=>{
  addCarrito(e)
})

items.addEventListener('click',e =>{
    btnAccion(e)
})



const fetchData = async () => {
    try{
      const res =await fetch('api.json')
      const data = await res.json()
      //console.log(data)
      pintarCards(data)
    }
    catch(error){
        console.log(error)

    }

}

const pintarCards= data=>{
    //console.log(data)
    data.forEach(producto => {
        templateCard.querySelector('h5').textContent=producto.title
        templateCard.querySelector('p').textContent=producto.precio
        templateCard.querySelector('img').setAttribute('src',producto.thumbnailUrl)
        templateCard.querySelector('.btn-dark').dataset.id=producto.id
        



        const clone=templateCard.cloneNode(true)
        fragment.appendChild(clone)
    });
    cards.appendChild(fragment)
}
//Estoy capturando mis elementos 
const addCarrito= e =>{
    //console.log(e.target)
    if(e.target.classList.contains('btn-dark'))
    {
       //mandando el elemento clickeado a setcarrito
       setCarrito(e.target.parentElement)
    }
    e.stopPropagation() 
}

const setCarrito= objeto =>{
    //console.log(objeto)
     const producto={
        id:objeto.querySelector('.btn-dark').dataset.id,
        title:objeto.querySelector('h5').textContent,
        precio:objeto.querySelector('p').textContent,
        cantidad:1
     }
     if(carrito.hasOwnProperty(producto.id)){
        producto.cantidad=carrito[producto.id].cantidad+1
     }
     carrito[producto.id]={...producto}
     pintarCarrito()
     //console.log(producto )
}

const pintarCarrito= ()=>{
    //para limpiar 
    items.innerHTML=''
    Object.values(carrito).forEach(producto =>{
        templateCarrito.querySelector('th').textContent=producto.id
        templateCarrito.querySelectorAll('td')[0].textContent=producto.title
        templateCarrito.querySelectorAll('td')[1].textContent=producto.cantidad
        templateCarrito.querySelector('.btn-info').dataset.id=producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id=producto.id
        templateCarrito.querySelector('span').textContent=producto.cantidad *producto.precio
        
        const clone= templateCarrito.cloneNode(true)
        fragment.appendChild(clone)


    })
    items.appendChild(fragment)


    pintarFooter()
    //guardando mi coleccion de objetos a string plano a local storage
    localStorage.setItem('carrito',JSON.stringify(carrito))
}

const pintarFooter=()=>
{
    footer.innerHTML=''
    if( Object.keys(carrito).length===0){
        footer.innerHTML=`<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>`
          return
    }
     //como es una coleccion de objetos no puedo utilizar todas las funcionalidades del array asi que uso values
     // como lo que me devuelve es un numero no le estoy poniendo llaves al cero 
    const ncantidad= Object.values(carrito).reduce((acc,{cantidad})=>acc + cantidad ,0)
    const nprecio= Object.values(carrito).reduce((acc,{cantidad,precio})=>acc + cantidad*precio ,0)
   templateFooter.querySelectorAll('td')[0].textContent=ncantidad
   templateFooter.querySelector('span').textContent=nprecio
   const clone=templateFooter.cloneNode(true)
   fragment.appendChild(clone)
   footer.appendChild(fragment)

   const btnVaciar=document.getElementById('vaciar-carrito')
   btnVaciar.addEventListener('click',()=>{
      carrito={}
      pintarCarrito()
   })
}

const btnAccion = e => {
    //para aumentar --prefiero usar esto que el find 
    //console.log(e.target)
    if(e.target.classList.contains('btn-info')){
        console.log(carrito[e.target.dataset.id])
        //carrito[e.target.dataset.id]
        const articulo=carrito[e.target.dataset.id]
        articulo.cantidad= carrito[e.target.dataset.id].cantidad +1
        carrito[e.target.dataset.id]={...articulo}

        pintarCarrito()
    }

    if(e.target.classList.contains('btn-danger')){
        const articulo=carrito[e.target.dataset.id]
        articulo.cantidad= carrito[e.target.dataset.id].cantidad -1
        if(articulo.cantidad===0){
            delete carrito[e.target.dataset.id]
        }
        pintarCarrito()
    }

   e.stopPropagation() 


}