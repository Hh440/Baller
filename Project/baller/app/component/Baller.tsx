'use client'
import { Canvas } from "@react-three/fiber"
import Model from "./Model"
import { Suspense } from "react"
import { Center,Environment, OrbitControls } from "@react-three/drei"

const Baller = ()=>{
    return(
        <Canvas gl={{antialias:true}} style={{background:"#q231244"}}>
            <OrbitControls/>
            <directionalLight position={[0,3,2]} intensity={3}/>
            <Environment preset="warehouse"/>
            <Suspense fallback={null}/>
            <Center>
                <Model/>
            </Center>
        </Canvas>
    )
}

export default Baller