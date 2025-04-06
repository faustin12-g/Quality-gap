import { useState } from "react";
import { motion } from "framer-motion";
import RS from "../assets/TRS.jpg";
import OIP from "../assets/OIP.jpeg";
import ASS from "../assets/ASS.png";
import IM from "../assets/IM.jpeg";
import TTB from "../assets/TTB.jpeg";
import PI from "../assets/PI.jpeg";
import Section from "./Section";
import Heading from "./Heading";



const Benefits = () => {
      const service = [
        {
          title: "Teacher Interaction & Resource Sharing",
          description:
            "At QualityGap,we believe that the collective expertise of educators is a powerful asset. Our platform empowers teachers to share resources, ideas, and best practices, fostering a collaborative learning environment.",
          image: RS,
        },
        {
          title: "Empowering Parental Engagement",
          description:
            "The QualityGap platform prioritizes the role of parents in the educational journey. Our Parent Dashboard provides an intuitive and accessible interface for parents to stay actively involved in their children's education.",
          image: PI,
        },
        {
          title: "Streamlined and Transparent Assessment",
          description:
            "QualityGap’s Grading System is designed to provide accurate, consistent, and transparent evaluations of student performance. Our platform ensures that grading is not only efficient but also insightful, offering a comprehensive view of each student's academic progress.",
          image: ASS,
        },
        {
          title: "Efficient and Flexible Scheduling",
          description:
            "QualityGap’s Timetable Management system is designed to simplify and optimize the scheduling process, ensuring that schools run smoothly and efficiently.",
          image: TTB,
        },
        {
          title: "Effective Allocation and Utilization",
          description:
            "QualityGap’s Resource Management system ensures that schools efficiently allocate and utilize their resources, leading to a well-organized and productive educational environment.",
          image: IM,
        },
        {
          title: "Student Performance Analytics",
          description:
            "Comprehensive Reports: Generate detailed reports on student performance, including academic progress, attendance, and behavior, Predictive Analysis: Utilize predictive analytics to identify at-risk students and provide early interventions to support their success.",
          image: OIP,
        },
      ];
    return(
        <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 20 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <Section id="features">
        <div className="container relative z-2">

                           
                <Heading className="md:max-w-md lg:max-w-2xl"
                title = "Revolutionalize School with tools to streamline all activities" />
            <div className="flex flex-wrap gap-10 mb-10">
                <div className="min-h-screen bg-gray-100 pt-16">
                      <motion.div
                        className="max-w-7xl mx-auto py-12 px-4 grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                        initial="hidden"
                        animate="visible"
                        variants={{
                          hidden: { opacity: 0 },
                          visible: {
                            opacity: 1,
                            transition: {
                              staggerChildren: 0.2,
                            },
                          },
                        }}
                      >
                        {service.map((service, index) => (
                          <ServiceCard key={index} service={service} />
                        ))}
                      </motion.div>
                    </div>
            </div>
        </div>
        </Section>
        </motion.div>
  )
}

// Service Card Component
const ServiceCard = ({ service }) => {
    const [showMore, setShowMore] = useState(false);
  
    return (
      <motion.div
        className="bg-white shadow-lg rounded-lg p-6"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <img
          src={service.image}
          alt={service.title}
          className="rounded-t-lg w-full h-40 object-cover"
        />
        <h2 className="text-xl font-bold mt-4">{service.title}</h2>
        <p className="text-gray-700 mt-2">
          {showMore ? service.description : `${service.description.slice(0, 60)}...`}
          
        </p>
        <button
          className="mt-4 text-blue-500 hover:underline"
          onClick={() => setShowMore(!showMore)}
        >
          {showMore ? "See Less" : "See More"}
        </button>
      </motion.div>
    );
  };
  

export default Benefits
