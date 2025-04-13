import appstore from '../images/app-store.svg'
import playstore from '../images/google-play.svg'
import Image from 'next/image'

function DownloadApp() {
    return (
        <section className="py-16 bg-gradient-to-b from-primary/5 to-background pb-24">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-4xl font-bold mb-8">Lasoo Deg applicationka-ka</h2>
                <p className="text-xl text-gray-600 mb-12">
                    Ka faa`ideyso casharada meel kasta iyo wakhti kasta  Naftaada Hormari
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                    <div className="relative">
                        <Image
                            src={appstore}
                            alt="Download on App Store"
                            width={140}
                            height={56}
                            className="opacity-50 cursor-not-allowed"
                        />
                        <span className="absolute -top-2 -right-2 px-1.5 py-0.5 text-[10px] font-semibold bg-yellow-100 text-yellow-800 rounded-full border border-yellow-200">
                            Dhowaan
                        </span>
                    </div>
                    <div className="relative">
                        <Image
                            src={playstore}
                            alt="Get it on Google Play"
                            width={140}
                            height={56}
                            className="opacity-50 cursor-not-allowed"
                        />
                        <span className="absolute -top-2 -right-2 px-1.5 py-0.5 text-[10px] font-semibold bg-yellow-100 text-yellow-800 rounded-full border border-yellow-200">
                            Dhowaan
                        </span>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default DownloadApp
