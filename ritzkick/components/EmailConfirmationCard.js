import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'


export default function EmailConfirmationCard() {
    const router = useRouter()
    const { key } = router.query

    useEffect(() => {
        if(key !== undefined){
            //Api call
            console.log(key)
        }
    }, [key])

  return (
    <div className='form'>
        <h1 className="form-title">Confirmation de courriel</h1>
        <h3>Votre courriel est maintenant confirmé!</h3>
        <Link href="/login">
          <a className="link">Connectez-vous</a>
        </Link>
    </div>
  )
}
