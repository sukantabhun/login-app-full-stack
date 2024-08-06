import './index.css'

const Home = (props) => {
    const {userDetails} = props
    const {name} = userDetails

    return(
    <div>
        <h1 className="heading">Welcome to my home page , {name}</h1>
    </div>
    )
}

export default Home