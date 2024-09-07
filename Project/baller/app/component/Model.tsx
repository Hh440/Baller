'use client'

import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef ,useState,useEffect} from "react"

import { Group, MathUtils,Color,MeshStandardMaterial,MeshBasicMaterial,Mesh } from "three";




const Model = ()=>{

    useGLTF('/media/ball.glb')
    const [axis, setAxis] = useState<'x' | 'y'|'z'>('y');

    const group = useRef<Group>(null);

    const {viewport} =  useThree()

    

    useEffect(() => {
        const interval = setInterval(() => {
            setAxis((prevAxis) => {
                if (prevAxis === 'y') return 'x'; 
                if (prevAxis === 'x') return 'z'; 
                return 'y'; 
            });
        }, 20000); 

        return () => clearInterval(interval); // Clean up on unmount

        
    }, []);

    useFrame(() => {
        if (group.current) {
            // Rotate around the chosen axis
            if (axis === 'y') {
                group.current.rotateY(MathUtils.degToRad(0.2));
            } else if (axis === 'x') {
                group.current.rotateX(MathUtils.degToRad(0.2));
            } else if (axis === 'z') {
                group.current.rotateZ(MathUtils.degToRad(0.2));
            }
        }
    });

    const {nodes,animations,scene}= useGLTF('/media/ball.glb')
    const action= useAnimations(animations,scene)

    
   

    

    
    return(
        <group ref={group}  dispose={null}  scale={viewport.width/100}>
            
            
                <primitive object={scene}/>

                   
                
            
                    
            
        </group>
        
    )
}

export default Model