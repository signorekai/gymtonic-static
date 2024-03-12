import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useMemo, useState } from 'react';
import Cookies from 'js-cookie';
import { gql, useQuery } from '@apollo/client';
import { find } from 'lodash';

const query = gql`
  {
    popups(where: { orderby: { field: DATE, order: ASC }, status: PUBLISH }) {
      edges {
        node {
          id
          content(format: RENDERED)
          title(format: RENDERED)
          date
          popupFields {
            expirationDate
          }
        }
      }
    }
  }
`;

const Modal = () => {
  const [showModal, setShowModal] = useState(false);
  const [popups, setPopups] = useState([]);
  const { data } = useQuery(query);

  useEffect(() => {
    if (showModal) {
      document.querySelector('html')?.classList.add('overflow-hidden');
    } else {
      document.querySelector('html')?.classList.remove('overflow-hidden');
    }
  }, [showModal]);

  useEffect(() => {
    if (data) {
      const newPopups = [];
      data.popups.edges.map(({ node }) => {
        if (
          (node.popupFields.expirationDate &&
            Math.round(Date.now() / 1000) <= node.popupFields.expirationDate) ||
          Object.is(node.popupFields.expirationDate, null)
        ) {
          if (
            typeof find(newPopups, { id: node.id }) === 'undefined' &&
            typeof Cookies.get(`popup-${node.id}`) === 'undefined'
          ) {
            newPopups.push(node);
          }
        }
      });
      setPopups(newPopups);
      // setPopups([...popups, node]);
    }
  }, [data]);

  useEffect(() => {
    setShowModal(popups.length > 0);
  }, [popups]);

  const closePopup = () => {
    const newPopups = [...popups];
    Cookies.set(`popup-${popups[0].id}`, true, { expires: 7 });
    newPopups.shift();
    setPopups(newPopups);
  };

  return (
    <AnimatePresence exitBeforeEnter>
      {showModal && (
        <motion.div
          variants={{
            initial: { opacity: 0 },
            enter: {
              opacity: 1,
              transition: {
                delayChildren: 0.2,
                staggerChildren: 0.5,
              },
            },
            exit: { opacity: 0 },
          }}
          initial="initial"
          animate="enter"
          exit="exit"
          className="fixed bg-black-opaque z-80 top-0 left-0 w-full h-[100dvh] flex flex-col overflow-auto justify-center items-center p-4 lg:p-0">
          {popups.length > 0 && (
            <motion.div
              key={`popup-${popups[0].id}`}
              className="bg-pink max-w-[47rem] w-full p-10 md:p-18 relative z-20"
              variants={{
                initial: { y: '50%', opacity: 0 },
                enter: { y: 0, opacity: 1 },
                exit: { y: '50%', opacity: 0 },
              }}>
              <motion.button
                onClick={closePopup}
                className="mt-3 inline-block w-7 h-7 md:w-8 md:h-8 absolute top-0 right-4 z-40 lg:-top-10 lg:-right-10 hover:cursor-generic"
                variants={{
                  initial: { opacity: 0, y: -100 },
                  exit: { opacity: 0, y: -100 },
                  enter: { opacity: 1, y: 0 },
                }}
                type="button">
                <svg
                  className="w-full h-full text-red lg:text-white stroke-current hover:opacity-80 transition-opacity"
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 28 28">
                  <g transform="translate(1674 2629) rotate(-90)">
                    <g
                      transform="translate(2629 -1674) rotate(90)"
                      fill="none"
                      strokeWidth="1.5">
                      <circle cx="14" cy="14" r="14" stroke="none" />
                      <circle cx="14" cy="14" r="13.25" fill="none" />
                    </g>
                    <line
                      x2="14"
                      transform="translate(2619.949 -1664.854) rotate(135)"
                      fill="none"
                      strokeWidth="1.5"
                    />
                    <line
                      x2="14"
                      transform="translate(2619.949 -1654.954) rotate(-135)"
                      fill="none"
                      strokeWidth="1.5"
                    />
                  </g>
                </svg>
              </motion.button>
              <h2 className="font-black text-red text-lg md:text-2xl mt-3 mb-4 leading-none">
                {popups[0].title}
              </h2>
              <div
                className="modal--content"
                dangerouslySetInnerHTML={{
                  __html: popups[0].content.replace(
                    'https://gymtonic.sg',
                    'https://backend.gymtonic.sg',
                  ),
                }}></div>
            </motion.div>
          )}
          <div
            className="w-full h-full absolute -z-10"
            onClick={closePopup}></div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
