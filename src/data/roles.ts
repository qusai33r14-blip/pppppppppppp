/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RoleDefinition, RoleId, RoleCounts } from '../types/mafia';

export const CREST_IMAGE = '/src/assets/images/mafia_game_crest_1793030253584.jpg';

export const ROLES: Record<RoleId, RoleDefinition> = {
  citizen: {
    id: 'citizen',
    name: 'المواطن الصالح',
    englishTitle: 'The Innocent Citizen',
    emoji: '🧑',
    side: 'CIVILIAN',
    sideName: 'حلف المدينة الصالحة',
    accentColor: '#38bdf8', // Sky/Sapphire blue
    glowColor: 'rgba(56, 189, 248, 0.4)',
    image: '/src/assets/images/role_citizen_1793030256562.jpg',
    shortDesc: 'مواطن بريء يعتمد على الفراسة والتصويت الجماعي لطرد المافيا.',
    fullDesc: 'أنت مواطن شريف ونزيه في المدينة. ليس لديك صلاحيات ليلية سرية، لكن صوتك في محكمة المدينة بالنهار هو سلاحك الأقوى لكشف وتصفية عناصر المافيا.',
    nightActionDesc: 'تنام نوماً عميقاً مع أهل المدينة، ولا تفتح عينيك أبداً في الليل.',
    proTip: 'راقب المترددين في التصويت، واستمع بنباهة لمن يحاول تشتيت الانتباه عن المتهمين الحقيقيين.'
  },
  silencer_mafia: {
    id: 'silencer_mafia',
    name: 'مافيا التسكيت',
    englishTitle: 'The Silencer Mafia',
    emoji: '🤐',
    side: 'MAFIA',
    sideName: 'عصابة المافيا',
    accentColor: '#a855f7', // Royal purple/violet
    glowColor: 'rgba(168, 85, 247, 0.45)',
    image: '/src/assets/images/role_mafia_silencer_1793030254095.jpg',
    shortDesc: 'عضو خبيث يخرس أحد اللاعبين ويمنعه تماماً من الحديث في اليوم التالي.',
    fullDesc: 'تشارك العصابة قراراتها الخبيثة، وتملك قدرة التسكيت الفريدة: كل ليلة تختار لاعباً لتمنعه من النطق طوال النهار التالي! يمكن للضحية الإشارة أو التصويت فقط دون أي كلام.',
    nightActionDesc: 'تستيقظ مع المافيا، ثم يستدعيك المشرف منفرداً لتشير بإصبعك إلى الشخص الذي تريد كتم صوته لليوم التالي.',
    proTip: 'اختر إسكات المحقق إذا اشتبهت به، أو أسكت أكثر المواطنين إقناعاً وبلاغة لتربك دفاع المدينة.'
  },
  assassin_mafia: {
    id: 'assassin_mafia',
    name: 'مافيا الاغتيال',
    englishTitle: 'Godfather Assassin',
    emoji: '🔪',
    side: 'MAFIA',
    sideName: 'عصابة المافيا (الزعيم)',
    accentColor: '#ef4444', // Blood crimson
    glowColor: 'rgba(239, 68, 68, 0.5)',
    image: '/src/assets/images/role_mafia_assassin_1793030253847.jpg',
    shortDesc: 'زعيم المافيا والكلمة الفاصلة في تصفية الضحايا ليلاً.',
    fullDesc: 'أنت العقل المدبر لعمليات الاغتيال في العصابة. إذا اختلف أفراد المافيا على الهدف ليلاً، فإشارتك أنت هي القرار الحاسم لتحديد من يموت قبل بزوغ الفجر.',
    nightActionDesc: 'تستيقظ مع أعضاء عصابتك ليلاً وتتفقون بالإشارة الصامتة على ضحية الاغتيال.',
    proTip: 'كن هادئاً وشارك في النقاش الصباحي كأنك مواطن متحمس يبحث عن المافيا لتبعد الشبهة عنك.'
  },
  regular_mafia: {
    id: 'regular_mafia',
    name: 'مافيا عادية',
    englishTitle: 'Syndicate Mobster',
    emoji: '🕶️',
    side: 'MAFIA',
    sideName: 'عصابة المافيا',
    accentColor: '#f43f5e', // Rose crimson
    glowColor: 'rgba(244, 63, 94, 0.4)',
    image: '/src/assets/images/role_regular_mafia_1793030273240.jpg',
    shortDesc: 'عضو محترف في العصابة يشارك في اختيار الضحايا والتضليل.',
    fullDesc: 'عنصر قتالي بارع في صفوف المافيا. مهمتك مساعدة رفاقك في تصفية مواطني المدينة ليلاً، وتوجيه أصابع الاتهام زوراً نحو الأبرياء نهاراً.',
    nightActionDesc: 'تستيقظ مع أعضاء المافيا بالإشارة الصامتة للاتفاق على تصفية أحد لاعبي المدينة.',
    proTip: 'لا تتطابق آراؤك دائماً مع باقي أفراد المافيا علناً حتى لا يربط المحقق والمدينة بينكم بسهولة.'
  },
  doctor: {
    id: 'doctor',
    name: 'الطبيب',
    englishTitle: 'The Doctor',
    emoji: '🩺',
    side: 'CIVILIAN',
    sideName: 'حلف المدينة الصالحة',
    accentColor: '#10b981', // Emerald green
    glowColor: 'rgba(16, 185, 129, 0.45)',
    image: '/src/assets/images/role_doctor_1793030255570.jpg',
    shortDesc: 'حامي الأرواح، يختار لاعباً كل ليلة لإسعافه وإنقاذه من الاغتيال.',
    fullDesc: 'ملاك الرحمة في شوارع المدينة المظلمة. كل ليلة تستيقظ سراً وتختار لاعباً واحداً لإسعافه. إذا حاولت المافيا اغتياله في تلك الليلة، ينجو ويعلن المشرف صباحاً أنه لم يمت أحد!',
    nightActionDesc: 'تستيقظ عندما يناديك المشرف وتختار لاعباً واحداً لحمايته من الاغتيال لتلك الليلة.',
    proTip: 'توقع من ستقوم المافيا باستهدافه. إذا نجح المحقق في كشف مافيا، فاحرص على حماية المحقق في الليلة التالية فوراً.'
  },
  detective: {
    id: 'detective',
    name: 'المحقق',
    englishTitle: 'The Detective',
    emoji: '🕵️',
    side: 'CIVILIAN',
    sideName: 'حلف المدينة الصالحة',
    accentColor: '#f59e0b', // Amber gold
    glowColor: 'rgba(245, 158, 11, 0.45)',
    image: '/src/assets/images/role_detective_1793030256947.jpg',
    shortDesc: 'عين القانون الساهرة، يستجوب مشتبهاً به كل ليلة ليكتشف هويته.',
    fullDesc: 'المحقق الذكي الذي يلاحق خيوط الجريمة. كل ليلة تستيقظ وتشير للمشرف إلى لاعب واحد، فيجيبك المشرف بإشارة متفق عليها (إبهام لأعلى = مافيا، إبهام لأسفل = مواطن بريء).',
    nightActionDesc: 'تستيقظ ليلاً وتسأل المشرف بالإشارة عن هوية لاعب واحد لتكتشف هل هو مافيا أم صالح.',
    proTip: 'لا تصرح بأنك المحقق من اليوم الأول! احتفظ بمعلوماتك ووجّه التصويت بذكاء حتى تصبح الأدلة قاطعة.'
  }
};

export const ROLE_LIST = Object.values(ROLES);

export const DEFAULT_ROLE_COUNTS: RoleCounts = {
  citizen: 3,
  silencer_mafia: 1,
  assassin_mafia: 1,
  regular_mafia: 0,
  doctor: 1,
  detective: 1,
};

// Recommended setups for different player numbers
export function getRecommendedRoleSetup(playerCount: number): RoleCounts {
  if (playerCount <= 4) {
    return { citizen: 2, silencer_mafia: 0, assassin_mafia: 1, regular_mafia: 0, doctor: 1, detective: 0 };
  }
  if (playerCount === 5) {
    return { citizen: 2, silencer_mafia: 0, assassin_mafia: 1, regular_mafia: 0, doctor: 1, detective: 1 };
  }
  if (playerCount === 6) {
    return { citizen: 2, silencer_mafia: 1, assassin_mafia: 1, regular_mafia: 0, doctor: 1, detective: 1 };
  }
  if (playerCount === 7) {
    return { citizen: 3, silencer_mafia: 1, assassin_mafia: 1, regular_mafia: 0, doctor: 1, detective: 1 };
  }
  if (playerCount === 8) {
    return { citizen: 4, silencer_mafia: 1, assassin_mafia: 1, regular_mafia: 0, doctor: 1, detective: 1 };
  }
  if (playerCount === 9) {
    return { citizen: 4, silencer_mafia: 1, assassin_mafia: 1, regular_mafia: 1, doctor: 1, detective: 1 };
  }
  if (playerCount === 10) {
    return { citizen: 5, silencer_mafia: 1, assassin_mafia: 1, regular_mafia: 1, doctor: 1, detective: 1 };
  }
  if (playerCount >= 11) {
    const mafiaTotal = Math.max(2, Math.floor(playerCount / 3.2));
    const silencer = 1;
    const assassin = 1;
    const regular = Math.max(0, mafiaTotal - silencer - assassin);
    const doctor = 1;
    const detective = 1;
    const citizens = playerCount - (silencer + assassin + regular + doctor + detective);
    return {
      citizen: Math.max(1, citizens),
      silencer_mafia: silencer,
      assassin_mafia: assassin,
      regular_mafia: regular,
      doctor: doctor,
      detective: detective
    };
  }
  return DEFAULT_ROLE_COUNTS;
}
