function SelectorComponent(props: any) {

  return(
    <div>
     <p>Available services:</p>
     <ul>
        {
            props.services ? 
            props.services.map((service: number, index: number) => (
                <li key={index} onClick={() => props.setSelectedService(service)}>
                    {service}
                </li>
            ))
            :
            <p>No services currently available!</p>
        }  
     </ul> 
    </div>
  )
}

export default SelectorComponent;