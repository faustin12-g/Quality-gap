

const Section = ({
    className,
    id,
    crosses,
    crossesOffset,
    customPadding,
    children}
) => {
  return (
    <div id={id} className={`relative ${
        customPadding ||
         `py-10 lg:py-16 xl:py-20 ${
         crosses ? 'lg:py-32 xl:py-40':""} ${
         className || ""}`
        }`}
         >

            {children}
            <div className="hidden absolute top-0 left-5 w-0.25 h-full bg-blue-950/5 pointer-events-none md:block lg:left-7 xl:left-10">  
            </div>
            <div className="hidden absolute top-0 left-5 w-0.25 h-full bg-blue-950/5 pointer-events-none md:block lg:right-7 xl:right-10">  </div>
            {crosses && (
                <>
                    <div className={`hidden absolute top-0 left-7 right-7 h-0.5 bg-blue-950/5 ${
                        crossesOffset && crossesOffset
                    } pointer-events-none lg:block xl:left-10 right-10`}>
                    </div>
                </>
            )}
    </div>
  )
}

export default Section
