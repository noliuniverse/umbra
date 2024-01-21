"use client";
import Image from 'next/image'
import React, { useRef, useState, useEffect } from 'react';
import { useRouter} from "next/navigation";
import { QrReader } from "react-qr-reader";
import dynamic from "next/dynamic";
import ObjektModal from '@/components/ObjektModal';
import {createClientComponentClient} from "@supabase/auth-helpers-nextjs";
import { Noto_Kufi_Arabic } from 'next/font/google';
/*
{isRecording && 
     <QrReader
              onScan={(result, error) => {
                  if (!!result) {

                    this.look;
                      
                    if (dataID == true){
                      var string = result?.text.split("?")[1];


                    }


                  }

                  
              }}
              onError={(error) => {}}
              facingMode="user"
              style={{ width: '50%' , margin:'auto'}}
          />}*/

export default function Scan() {

  // OBJEKT MODAl
  const [img, setimg] = useState('https://i.seadn.io/s/raw/files/42f630850aabd230c0bf508183fb4961.png?auto=format&dpr=1&w=256')
  const [theID, setTheID] = useState('309A')
  const [member, setMember] = useState('SooMin')
  const [serial, setSerial] = useState('1')

  const [isModalOpen, setModalOpen] = useState(false)
  const [dataID, setData] = useState('');
  const [isRecording, setIsRecording] = useState(true)
  const [delayScan, setDelayScan] = useState(500)
  const [cameraDirection, setcameraDirection] = useState("environment")
  
  const router = useRouter()
  const navRef = useRef();
  const qrRef = useRef(null);
  const lastResult = useRef();
    const handleRedirect = (re) => {
        router.push(re)
        router.refresh();


      }

      const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();
  const closeCam = async () => {

};
      const handleScan = async (result, error) => {
            if (!!result) {
            var string = result?.text;
            
            const searchParams = new URLSearchParams(string.split("?")[1]);
            console.log("la" + searchParams.get('i'));
            if (searchParams.get('i').toString() == null) {setData("Not a valid code!");} else if (string.split("?")[0] != ('https://umbra.vercel.app/objekt')){setData("Not a valid code!");}
            else {
              if (lastResult.current === result.text) {
                return
              }
              if (isRecording == true){
              const searchI = searchParams.get('i');
              const { data:datas, error:errors } = await supabase
              .from('objektqrdata')
              .select('card_uuid')
              .eq('qr_id', searchI)
              .eq('used', false)
              console.log(datas);
              console.log(searchI);
            if (datas.length == 0) {
              setData('This objekt is not valid.');
            } 
            else if (datas.length == 1) {
              var uuid = datas[0]["card_uuid"];
              setData('Checking... DO NOT CLOSE YOUR BROWSER OR YOU MAY LOSE YOUR CARD.');
              setData('')
              setDelayScan(false);
              setIsRecording(false);
              const { data:datas2, error:errors2 } = await supabase
              .from('objektdata')
              .select()
              .eq('uuid', uuid)
              const { data:collection, error:errors3 } = await supabase
              .from('objektcollection')
              .select()
              .eq('uuid', uuid)
              // OBJEKT MODAL
              setimg(datas2[0]["photo"])
              setTheID(datas2[0]["card_id"])
              setMember(datas2[0]["member"])
              setSerial(collection.length+1)

              const { error4 } = await supabase
              .from('objektqrdata')
              .update({ used: true })
              .eq('qr_id', searchI)
              .eq('used', false)
              const { data, error } = await supabase.from('objektcollection').insert({ uuid: parseInt(uuid), serial: parseInt(collection.length+1), user_uuid: user.id.toString()})
              setModalOpen(true)
              

              
              
              
              
            }}

            

            }}
        

            if (!!error) {
              //console.info("llll");
            }
        }

  useEffect(() => {
    async function getUser(){
        const {data: {user}} = await supabase.auth.getUser()
        setUser(user)
        setLoading(false)
    }
    
    getUser();
    
}, [])

if (loading) {return (
  <main>
          <header className="navbarheader">
      <img src='https://i.imgur.com/I3ouDmc.png'  className='logo'/>
      <button className='headerbutton' onClick={() => handleRedirect("/")}>Home</button>
      <button className='headerbutton' onClick={() => handleRedirect("/login")}>Login</button>
      <button className='headerbutton' onClick={() => handleRedirect("/scan")}>Scan</button>
      <nav ref={navRef}>
      </nav>
    </header>
      <div className="div1">
      <h1 className="whitetext bigger">Loading...</h1>
      </div>
  </main>
  )}

if (user) { return (
  <main >
    <header className="navbarheader">
      <img src='https://i.imgur.com/I3ouDmc.png'  className='logo'/>
      <button className='headerbutton' onClick={() => handleRedirect("/")}>Home</button>
      <button className='headerbutton' onClick={() => handleRedirect("/login")}>Login</button>
      <button className='headerbutton' onClick={() => handleRedirect("/scan")}>Scan</button>
      <button className='headerbutton' onClick={() => handleRedirect("/collection")}>Collection</button>
      <nav ref={navRef}>
      </nav>
    </header>

    <div className="div1">
    <h1 className='whitetext bold'>Scan</h1>
    <small className='whitetext'>Place your custom objekt's QR code in the center.</small>
    { isRecording && <div className='qrreader' style={{margin: "auto"}}>
     <QrReader
              className="lg:h-[400px] lg:w-[400px] h-[300px] w-[300px]"
              onResult={handleScan}
              constraints={{ facingMode: cameraDirection }}
              style={{ width: "40%", height: "40%", margin: "auto"}}
              ref={qrRef}
              scanDelay={delayScan}

            />
    
     <button className='button2 sc' onClick={(e) => {setcameraDirection("user")}}>Front</button>
     <button className='button2 sc' onClick={(e) => {setcameraDirection("environment")}}>Rear</button>
     </div>}
          <p className='whitetext'>{dataID.toString()}</p>
          {isModalOpen && <ObjektModal img={img} id={theID} member={member} serial={serial}/>}
          </div>
  </main>
)}
      
  return (
    <main>
      <header className="navbarheader">
        <img src='https://i.imgur.com/I3ouDmc.png'  className='logo'/>
        <button className='headerbutton' onClick={() => handleRedirect("/")}>Home</button>
        <button className='headerbutton' onClick={() => handleRedirect("/login")}>Login</button>
        <button className='headerbutton' onClick={() => handleRedirect("/scan")}>Scan</button>
        <nav ref={navRef}>
        </nav>
      </header>

      <div className="div1">
      <h1 className='whitetext bold'>Scan</h1>
       
            <p className='whitetext'>You need to sign in to get access to scanning!</p>
            </div>
    </main>
  )
}
