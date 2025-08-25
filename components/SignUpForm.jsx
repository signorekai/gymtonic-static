/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-props-no-spreading */
import { gql, useQuery } from '@apollo/client';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import Head from 'next/head';

import Bubble from '../components/Bubble';

import LoadingGif from '../assets/images/loading.gif';
import SuccessEng from '../assets/images/SignUpComplete-Eng.png';
import SuccessMy from '../assets/images/SignUpComplete-Malay.png';
import SuccessZh from '../assets/images/SignUpComplete-Mandarin.png';
import ShareBtn from '../assets/images/share.png';
import TelegramBtn from '../assets/images/telegram.png';
import LinkBtn from '../assets/images/link.png';
import FacebookBtn from '../assets/images/facebook.png';
import WhatsAppBtn from '../assets/images/whatsapp.png';

const defaults = {
  title: 'Sign up',
  chooseOne: 'Come, choose one',
  subtitle:
    "Congratulations! You're taking the first step towards a stronger, better you.",
  name: 'My Name',
  age: 'My Age',
  email: 'My Email Address',
  contact: 'My Contact No.',
  myAddress: 'My Home Address',
  note: 'Note to Us (E.g. Any health conditions?)',
  seniorName: `Senior's Name`,
  seniorAge: `Senior's Age`,
  seniorAddress: `Senior's Home Address`,
  warning:
    'Each sign-up is a commitment of 24 sessions. Twice weekly, ~1 hour/session with guidance from a trainer.<br />Please note that transportation is not provided.',
  selectGym: 'Select preferred gym',
  signUpForMyself: 'I am signing up for myself',
  signUpForSomeoneElse: 'I am signing up for someone else',
  submit: 'submit',
  shareText: 'I just signed up for this gym. Who wants to join me?',
  linkCopied: 'Link Copied',
  invite: '<em>Jio</em> your friends',
  success: `<p>
  If you have any questions, <br />WhatsApp or call us at
  <a href="tel:96882388">9688 2388</a> or email
  <a href="mailto:hello@gymtonic.sg">hello@gymtonic.sg</a>
</p>`,
};

const text = {
  en: defaults,
  zh: {
    title: '报名',
    chooseOne: '来… 选一个',
    subtitle: '恭喜您，为更健壮的自己跨出第一步！',
    name: '我的名字',
    age: '我的年龄',
    email: '我的电邮',
    contact: '我的联络号码',
    myAddress: '我的地址',
    note: '须注意事项（例如：任何健康状况？）',
    seniorName: '长者名字',
    seniorAge: '长者年龄',
    seniorAddress: '长者地址',
    warning:
      '报名时，需签约24堂课，每周两次。1小时的运动，有教练引导。<br />报名者需安排自己的交通',
    selectGym: '您首选的健得力中心',
    signUpForMyself: '我为自己报名',
    signUpForSomeoneElse: '我为别人报名',
    submit: '发送',
    shareText: 'I just signed up for this gym. Who wants to join me?',
    linkCopied: '网页链接已复制',
    invite: '邀请你的朋友一起健力!',
    success: `<p>
  如果您有任何疑问，<br />请使用 WhatsApp 或致电
  <a href="tel:96882388">9688 2388</a> 或发电邮至
  <a href="mailto:hello@gymtonic.sg">hello@gymtonic.sg</a>
</p>`,
  },
  ms: {
    ...defaults,
    title: 'Mendaftar',
    chooseOne: 'Pilih satu',
    subtitle:
      'Tahniah! Anda telah mengambil langkah pertama kepada anda yang lebih kuat, lebih baik.',
    name: 'Nama Saya',
    age: 'Umar Saya',
    email: 'Alamat Emel Saya',
    contact: 'Nombor Telefon Saya',
    myAddress: 'Alamat Saya',
    note: 'Catatan kepada Kami (E.g. Ada keadaan kesihatan?)',
    seniorName: 'Nama Senior',
    seniorAge: `Umur Senior`,
    seniorAddress: `Alamat Senior`,
    warning:
      'Harap maklum bahawa pengangkutan tidak disediakan. Warga emas mesti pergi ke lokasi Gym Tonic sendiri.',
    selectGym: 'Pilih gim',
    signUpForMyself: 'Saya mendaftar untuk saya sendiri',
    signUpForSomeoneElse: 'Saya mendaftar untuk orang lain',
    submit: 'Hantar',
    shareText: 'I just signed up for this gym. Who wants to join me?',
    linkCopied: 'Pilih satu',
    invite: 'Bawa kawan-kawan anda',
    success: `<p>
    Sekiranya anda mempunyai sebarang pertanyaan,<br />WhatsApp atau hubungi kami di 
  <a href="tel:96882388">9688 2388</a> atau e-mel
  <a href="mailto:hello@gymtonic.sg">hello@gymtonic.sg</a>
</p>`,
  },
  ta: {
    title: 'பதிவு',
    chooseOne: 'வாருங்கள், ஒன்றைத் தேர்ந்தெடுங்கள்',
    subtitle:
      'வாழ்த்துக்கள்! நீங்கள் ஒரு வலிமையான, சிறந்த நபராக மாறுவதற்கான முதல் அடியை எடுத்து வைக்கிறீர்கள்.',
    name: 'என் பெயர்',
    age: 'என் வயது',
    email: 'எனது மின்னஞ்சல் முகவரி',
    contact: 'எனது தொடர்பு எண்',
    myAddress: 'என் முகவரி',
    note: 'எங்களுக்கான குறிப்பு (E.g. மருத்துவ நிலை?)',
    seniorName: 'மூத்த நபரின் பெயர்',
    seniorAge: 'மூத்த நபரின் வயது',
    seniorAddress: 'மூத்த நபரின் வீட்டு முகவரி',
    warning:
      'போக்குவரத்து வாகனம் வழங்கப்படவில்லை என்பதை நினைவில் கொள்க. மூத்த நபர் Gym Tonic இருப்பிடத்திற்கு சொந்தமாக பயணம் செய்ய வேண்டும்.',
    selectGym: 'விருப்பமான உடற்பயிற்சி கூடத்தைத் தேர்ந்தெடுக்கவும்',
    signUpForMyself: 'நான் எனக்காக பதிவு செய்கிறேன்',
    signUpForSomeoneElse: 'நான் வேறொருவருக்காக பதிவு செய்கிறேன்',
    submit: 'சமர்ப்பிக்கவும்',
    shareText: 'I just signed up for this gym. Who wants to join me?',
    linkCopied: 'இணைப்பு நகலெடுக்கப்பட்டது!',
    invite: 'உங்கள்நண்பரக்ளளஅளைக்கவும்',
    success: `<p>
    உங்களுக்கு ஏதேனும் கேள்விகள் இருந்தால்,<br />WhatsApp செய்யுங்கள் அல்லது  
  <a href="tel:96882388">9688 2388</a> என்ற எண்ணில் எங்களை அழைக்கவும் அல்லது
  <a href="mailto:hello@gymtonic.sg">hello@gymtonic.sg</a> இல் எங்களுக்கு ஒரு மின்னஞ்சல் அனுப்பவும்.
</p>`,
  },
};

const textVariants = {
  initial: { y: -40, opacity: 0 },
  enter: { y: 0, opacity: 1 },
  exit: { y: -40, opacity: 0 },
};

const query = gql`
  {
    openToPublic: status(id: "dGVybToz") {
      name
      locations(
        where: { orderby: { field: MENU_ORDER, order: ASC }, status: PUBLISH }
        first: 1000
      ) {
        edges {
          node {
            id
            title
            locationFields {
              area
              openingSoon
              visibility
              clickable
            }
            featuredImage {
              node {
                id
                mediaDetails {
                  height
                  width
                }
                sourceUrl(size: MEDIUM)
              }
            }
          }
        }
      }
    }
  }
`;

const SignUpForm = ({ showForm, setShowSignUpForm, defaultValues }) => {
  const [lang, setLang] = useState('en');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showSharePanel, setShowSharePanel] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [showLocationSelector, setShowLocationSelector] = useState(true);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'onTouched',
    defaultValues: useMemo(() => {
      return defaultValues;
    }, [defaultValues]),
  });

  const watchSelectedGym = watch('selectedGym');
  const watchType = watch('type');
  const onSubmit = handleSubmit((data) => {
    setLoading(true);
    void fetch('/api/email', {
      method: 'post',
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then(() => {
        setSuccess(true);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  });

  const { data } = useQuery(query);

  const locations = useMemo(() => {
    return data?.openToPublic.locations?.edges.filter(({ node: location }) => {
      return location.locationFields.visibility && location.locationFields.clickable;
    })
  }, [data])

  useEffect(() => {
    reset(defaultValues);
    if (defaultValues.selectedGym && defaultValues.selectedGym.length > 0) {
      setShowLocationSelector(false);
    } else {
      setShowLocationSelector(true);
    }
  }, [defaultValues, reset]);

  useEffect(() => {
    if (showForm) {
      document.querySelector('html')?.classList.add('overflow-hidden');
    } else {
      document.querySelector('html')?.classList.remove('overflow-hidden');
    }
  }, [showForm]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setShowSharePanel(false);
      } else {
        setShowSharePanel(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <AnimatePresence exitBeforeEnter>
        {showForm && (
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
            className={`fixed bg-black-opaque z-70 top-0 left-0 w-full min-h-screen h-screen overflow-auto flex flex-col ${
              success ? 'justify-center' : 'justify-start'
            } items-center cursor-generic`}>
            <AnimatePresence exitBeforeEnter>
              {success ? (
                <>
                  <div className="w-80 h-80 rounded-full relative">
                    <motion.button
                      onClick={() => {
                        setShowSignUpForm(false);
                        setTimeout(() => {
                          setSuccess(false);
                        }, 300);
                      }}
                      className="mt-3 inline-block w-7 h-7 md:w-8 md:h-8 absolute top-0 right-4 z-40 lg:-top-4 lg:-right-4 hover:cursor-generic"
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
                    {lang === 'en' && (
                      <Image
                        src={SuccessEng}
                        layout="fill"
                        unoptimized
                        alt=""
                      />
                    )}
                    {lang === 'ms' && (
                      <Image src={SuccessMy} layout="fill" unoptimized alt="" />
                    )}
                    {lang === 'zh' && (
                      <Image src={SuccessZh} layout="fill" unoptimized alt="" />
                    )}
                    {lang === 'ta' && (
                      <Image
                        src={SuccessEng}
                        layout="fill"
                        unoptimized
                        alt=""
                      />
                    )}
                  </div>
                  <footer
                    dangerouslySetInnerHTML={{ __html: text[lang].success }}
                    className="text-sm text-center text-white justify-self-end pb-4 w-full max-w-xs pt-4 mx-auto"
                  />
                </>
              ) : (
                <motion.div
                  className="bg-pink max-w-3xl w-full lg:mt-28 px-4 md:px-16 relative"
                  variants={{
                    initial: { y: '50%', opacity: 0 },
                    enter: { y: 0, opacity: 1 },
                    exit: { y: '50%', opacity: 0 },
                  }}>
                  <motion.button
                    onClick={() => {
                      setShowSignUpForm(false);
                    }}
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
                  <div className="flex flex-row justify-start md:justify-center pt-5 md:pt-7 pb-2 md:pb-10">
                    <button
                      className={`lg:ml-6 mr-2 focus:outline-none lang-btn ${
                        lang === 'en' ? 'lang-btn--selected' : ''
                      }`}
                      type="button"
                      onClick={() => {
                        setLang('en');
                      }}>
                      Eng
                      <span className="hidden md:inline">lish</span>
                    </button>
                    <button
                      className={`mr-2 focus:outline-none lang-btn font-normal font-chinese ${
                        lang === 'zh' ? 'lang-btn--selected' : ''
                      }`}
                      type="button"
                      onClick={() => {
                        setLang('zh');
                      }}>
                      中文
                    </button>
                    <button
                      className={`mr-2 focus:outline-none lang-btn ${
                        lang === 'ms' ? 'lang-btn--selected' : ''
                      }`}
                      type="button"
                      onClick={() => {
                        setLang('ms');
                      }}>
                      Bahasa Melayu
                    </button>
                    <button
                      className={`mr-2 md:pr-0 focus:outline-none lang-btn ${
                        lang === 'ta' ? 'lang-btn--selected' : ''
                      }`}
                      type="button"
                      onClick={() => {
                        setLang('ta');
                      }}>
                      <img src="/images/tamil.svg" alt="" />
                    </button>
                    <button
                      className={`mr-6 md:pr-0 focus:outline-none share-btn ${
                        lang === 'ta' ? 'lang-btn--selected' : ''
                      }`}
                      type="button"
                      onClick={() => {
                        setShowSharePanel(!showSharePanel);
                      }}>
                      <Image
                        unoptimized
                        width={14}
                        height={17}
                        src={ShareBtn}
                        alt=""
                        layout="fixed"
                      />
                    </button>
                  </div>
                  {showSharePanel && (
                    <div className="share-panel">
                      <div className="absolute">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="27.178"
                          height="28.101"
                          viewBox="0 0 27.178 28.101">
                          <path
                            id="Path_14798"
                            data-name="Path 14798"
                            d="M3460,3051.328a33.859,33.859,0,0,0,2.257,10.829c2.7,7.125,9.184,15.825,24.136,16.522"
                            transform="translate(-3459.254 -3051.327)"
                            fill="none"
                            stroke="#000"
                            strokeWidth="1.5"
                          />
                        </svg>
                      </div>

                      <div className="share-panel__container">
                        <div className="share-panel__wrapper">
                          <span
                            dangerouslySetInnerHTML={{
                              __html: text[lang].invite,
                            }}
                          />
                          <div className="share-panel__icons">
                            <a
                              href={`https://wa.me/?text=${encodeURI(
                                text[lang].shareText,
                              )} - ${window.location.href}`}
                              target="_blank"
                              rel="noreferrer">
                              <Image
                                src={WhatsAppBtn}
                                loading="eager"
                                width={26}
                                height={26}
                                unoptimized
                                alt="Share on WhatsApp"
                              />
                            </a>
                            <a
                              href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
                              target="_blank"
                              rel="noreferrer">
                              <Image
                                src={FacebookBtn}
                                loading="eager"
                                width={26}
                                height={26}
                                unoptimized
                                alt="Share on Facebook"
                              />
                            </a>
                            <a
                              href={`https://telegram.me/share/url?url=${window.location.href}&text=${text[lang].shareText}`}
                              target="_blank"
                              rel="noreferrer">
                              <Image
                                src={TelegramBtn}
                                loading="eager"
                                width={26}
                                height={26}
                                alt="Share on Telegram"
                              />
                            </a>
                            <button
                              type="button"
                              onClick={() => {
                                const toBeCopied = window.location.origin;
                                void navigator.clipboard
                                  .writeText(toBeCopied)
                                  .then(() => {
                                    setLinkCopied(true);
                                  });
                              }}>
                              <Image
                                src={LinkBtn}
                                loading="eager"
                                width={26}
                                height={26}
                                unoptimized
                                alt="Share on Facebook"
                              />
                            </button>
                          </div>
                          {linkCopied && (
                            <p className="text-xs text-red uppercase">
                              {text[lang].linkCopied}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  <motion.h1
                    variants={textVariants}
                    className={`page-title text-red relative z-20 pt-2 pb-2 text-center form--${lang}`}>
                    {text[lang].title}
                  </motion.h1>
                  <motion.h2
                    variants={textVariants}
                    className={`form--${lang} text-xl md:text-2xl md:max-w-4/5 mx-auto leading-tighter text-black font-black text-center mb-6 md:mb-12`}>
                    {text[lang].subtitle}
                  </motion.h2>
                  <form
                    onSubmit={onSubmit}
                    className={`form--${lang}
                    ${loading ? 'pointer-events-none opacity-50 relative' : ''}
                    ${
                      watchType !== 'myself' && watchType !== 'someone else'
                        ? 'form--disabled'
                        : ''
                    }
                  `}>
                    <div className="field-group flex-wrap !items-start !border-b-0 !mb-6 md:justify-center">
                      <label className="text-red hover:cursor-generic md:pr-2">
                        <input
                          className="hidden input-radio"
                          type="radio"
                          value="myself"
                          {...register('type', {
                            required: true,
                          })}
                        />
                        <span>{text[lang].signUpForMyself}</span>
                      </label>
                      <label className="text-red text-right hover:cursor-generic md:pl-2">
                        <input
                          className="hidden input-radio"
                          type="radio"
                          value="someone else"
                          {...register('type', {
                            required: true,
                          })}
                        />
                        <span>{text[lang].signUpForSomeoneElse}</span>
                      </label>
                    </div>
                    <div className="form__inner-wrap">
                      {watchType === 'someone else' ? (
                        <>
                          <div className="field-group">
                            <div
                              className={`input-wrapper ${
                                errors.name ? 'has-error' : ''
                              }`}>
                              <input
                                type="text"
                                className="text-field"
                                placeholder={text[lang].name}
                                disabled={watchType !== 'someone else'}
                                {...register('name', {
                                  required: true,
                                  shouldUnregister: true,
                                })}
                              />
                            </div>
                            <div
                              className={`input-wrapper input-wrapper--left ${
                                errors.contact ? 'has-error' : ''
                              }`}>
                              <input
                                type="text"
                                disabled={watchType !== 'someone else'}
                                placeholder={text[lang].contact}
                                pattern="[0-9]*"
                                className="text-field md:border-l-2 border-red"
                                {...register('contact', {
                                  required: true,
                                  shouldUnregister: true,
                                })}
                              />
                            </div>
                          </div>
                          <div className="field-group">
                            <div
                              className={`input-wrapper ${
                                errors.email ? 'has-error' : ''
                              }`}>
                              <input
                                type="email"
                                className="text-field"
                                disabled={watchType !== 'someone else'}
                                placeholder={text[lang].email}
                                {...register('email', {
                                  required: true,
                                  shouldUnregister: true,
                                })}
                              />
                            </div>
                          </div>
                          <div className="field-group">
                            <div
                              className={`input-wrapper ${
                                errors.seniorName ? 'has-error' : ''
                              }`}>
                              <input
                                type="text"
                                className="text-field"
                                disabled={watchType !== 'someone else'}
                                placeholder={text[lang].seniorName}
                                {...register('seniorName', {
                                  required: true,
                                  shouldUnregister: true,
                                })}
                              />
                            </div>
                            <div
                              className={`input-wrapper input-wrapper--left  ${
                                errors.seniorAge ? 'has-error' : ''
                              }`}>
                              <input
                                type="number"
                                placeholder={text[lang].seniorAge}
                                disabled={watchType !== 'someone else'}
                                className="text-field md:border-l-2"
                                {...register('seniorAge', {
                                  min: 12,
                                  max: 99,
                                  valueAsNumber: true,
                                  shouldUnregister: true,
                                  required: true,
                                })}
                              />
                            </div>
                          </div>
                          <div className="field-group">
                            <div
                              className={`input-wrapper ${
                                errors.seniorAddress ? 'has-error' : ''
                              }`}>
                              <input
                                type="text"
                                className="text-field"
                                disabled={watchType !== 'someone else'}
                                placeholder={text[lang].seniorAddress}
                                {...register('seniorAddress', {
                                  required: true,
                                  shouldUnregister: true,
                                })}
                              />
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="field-group">
                            <div
                              className={`input-wrapper ${
                                errors.name ? 'has-error' : ''
                              }`}>
                              <input
                                type="text"
                                className="text-field"
                                disabled={watchType !== 'myself'}
                                placeholder={text[lang].name}
                                {...register('name', {
                                  required: true,
                                  shouldUnregister: true,
                                })}
                              />
                            </div>
                            <div
                              className={`input-wrapper input-wrapper--left  ${
                                errors.age ? 'has-error' : ''
                              }`}>
                              <input
                                type="number"
                                disabled={watchType !== 'myself'}
                                placeholder={text[lang].age}
                                className="text-field md:border-l-2"
                                min="12"
                                max="99"
                                pattern="[0-9]*"
                                {...register('age', {
                                  min: 12,
                                  max: 99,
                                  valueAsNumber: true,
                                  shouldUnregister: true,
                                  required: true,
                                })}
                              />
                            </div>
                          </div>
                          <div className="field-group">
                            <div
                              className={`input-wrapper ${
                                errors.email ? 'has-error' : ''
                              }`}>
                              <input
                                type="email"
                                disabled={watchType !== 'myself'}
                                className="text-field"
                                placeholder={text[lang].email}
                                {...register('email', {
                                  pattern:
                                    // eslint-disable-next-line no-useless-escape
                                    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                  required: true,
                                  shouldUnregister: true,
                                })}
                              />
                            </div>
                            <div
                              className={`input-wrapper input-wrapper--left ${
                                errors.contact ? 'has-error' : ''
                              }`}>
                              <input
                                type="text"
                                disabled={watchType !== 'myself'}
                                placeholder={text[lang].contact}
                                className="text-field md:border-l-2 border-red"
                                minLength={8}
                                {...register('contact', {
                                  pattern: /[0-9+]{8}/,
                                  required: true,
                                  shouldUnregister: true,
                                })}
                              />
                            </div>
                          </div>
                          <div className="field-group">
                            <div
                              className={`input-wrapper ${
                                errors.myAddress ? 'has-error' : ''
                              }`}>
                              <input
                                type="text"
                                disabled={watchType !== 'myself'}
                                className="text-field"
                                placeholder={text[lang].myAddress}
                                {...register('myAddress', {
                                  required: true,
                                  shouldUnregister: true,
                                })}
                              />
                            </div>
                          </div>
                        </>
                      )}
                      <div className="field-group">
                        <input
                          type="text"
                          disabled={
                            watchType !== 'myself' &&
                            watchType !== 'someone else'
                          }
                          className="text-field"
                          placeholder={text[lang].note}
                          {...register('note')}
                        />
                      </div>
                      <h6
                        className="text-red text-xs py-4 md:-mx-1 text-center"
                        dangerouslySetInnerHTML={{ __html: text[lang].warning }}
                      />

                      <button
                        type="button"
                        className={`mt-6 mb-0 py-2 w-full flex flex-row justify-center items-center ${
                          errors.selectedGym ? 'has-error' : ''
                        }`}
                        onClick={() => {
                          setShowLocationSelector(!showLocationSelector);
                        }}>
                        <h5 className="text-base text-red font-black text-center">
                          {text[lang].selectGym}
                        </h5>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`text-red stroke-current ml-2 ${
                            showLocationSelector ? '' : 'rotate-180'
                          }`}
                          width="13.084"
                          height="7.98"
                          viewBox="0 0 13.084 7.98">
                          <path
                            fill="none"
                            strokeWidth="1.5px"
                            d="M4315.6,3241.3l6.374,5.975-6.355,6.018"
                            transform="translate(3253.839 -4315.087) rotate(90)"
                          />
                        </svg>
                      </button>
                      <p className="text-center mb-4">{watchSelectedGym}</p>
                      <AnimatePresence exitBeforeEnter>
                        {showLocationSelector && (
                          <motion.div
                            className="w-full mb-3 flex flex-row flex-wrap justify-center items-start flex-last-item-align-start mx-auto h-full"
                            variants={{
                              initial: { maxHeight: 1 },
                              exit: { maxHeight: 1 },
                              enter: { maxHeight: 40000 },
                            }}>
                            {locations?.map(({ node: location }) => (
                              <>
                                {location.locationFields.openingSoon !==
                                  true && (
                                  <label
                                    key={location.id}
                                    htmlFor={location.id}
                                    className="w-1/2 md:w-1/3">
                                    <input
                                      className="hidden"
                                      id={location.id}
                                      type="radio"
                                      key={location.id}
                                      disabled={
                                        !watchType &&
                                        watchSelectedGym !==
                                          `${location.title} (${location.locationFields.area})`
                                      }
                                      defaultChecked={
                                        watchSelectedGym ===
                                        `${location.title} (${location.locationFields.area})`
                                      }
                                      value={`${location.title} (${location.locationFields.area})`}
                                      {...register('selectedGym', {
                                        required: true,
                                      })}
                                    />
                                    <Bubble
                                      variants={{
                                        initial: { y: -20, opacity: 0 },
                                        exit: { y: 0, opacity: 1 },
                                        enter: { y: 0, opacity: 1 },
                                      }}
                                      handler={() => {
                                        if (watchType) {
                                          setValue(
                                            'selectedGym',
                                            `${location.title} (${location.locationFields.area})`,
                                          );
                                          setValue(
                                            'selectedGymId',
                                            location.id
                                          )
                                          setShowLocationSelector(false);
                                        }
                                        // clickHandler(location);
                                      }}
                                      borderColor="pink"
                                      className="w-full md:pb-8 hover:cursor-generic border-pink"
                                      subTitleClassName="text-center text-xs"
                                      imageWrapperClassName={`${
                                        watchSelectedGym ===
                                        `${location.title} (${location.locationFields.area})`
                                          ? '!border-red'
                                          : ''
                                      }`}
                                      titleClassName="text-sm md:text-base text-center"
                                      comingSoon={
                                        location.locationFields.openingSoon
                                      }
                                      title={location.title}
                                      subtitle={location.locationFields.area}
                                      thumbnail={
                                        location.featuredImage
                                          ? location.featuredImage.node
                                              .sourceUrl
                                          : '/images/map-no-icon.png'
                                      }
                                    />
                                  </label>
                                )}
                              </>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                      {loading && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="pointer-events-none mx-auto w-full text-center">
                          <Image
                            src={LoadingGif}
                            alt=""
                            width={126}
                            height={222}
                            unoptimized
                          />
                        </motion.div>
                      )}
                      {!loading && (
                        <button
                          type="submit"
                          className="block mx-auto overflow-hidden hover:cursor-submit">
                          <div className="rounded-full uppercase text-xs pt-3 bg-red text-white w-24 h-24 -mb-16 text-center submit-text">
                            {text[lang].submit}
                          </div>
                        </button>
                      )}
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default function withSignUpForm(Component) {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.setShowSignUpForm = this.setShowSignUpForm.bind(this);
      this.state = {
        showForm: false,
        defaultValues: {
          selectedGym: '',
        },
      };
    }

    setShowSignUpForm(showForm, defaultValues = {}) {
      this.setState({ showForm, defaultValues });
    }

    render() {
      const { defaultValues, showForm } = this.state;
      return (
        <>
          <SignUpForm
            defaultValues={defaultValues}
            showForm={showForm}
            setShowSignUpForm={this.setShowSignUpForm}
          />
          <Component
            {...this.props}
            setShowSignUpForm={this.setShowSignUpForm}
          />
        </>
      );
    }
  };
}
