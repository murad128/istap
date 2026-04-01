export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">İşTap haqqında</h1>
      <p className="text-gray-500 mb-8">Azərbaycanda iş axtaranlar üçün etibarlı platforma</p>

      <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-6 shadow-sm">
        <p className="text-gray-700 leading-relaxed mb-4">
          İşTap Azərbaycanda iş axtarışını asanlaşdırmaq məqsədilə yaradılmış platformadır. Biz ölkənin tanınmış vakansiya resurslarından elanları toplayır, dublikatları silir və sizə rahat bir interfeysdə təqdim edirik.
        </p>
        <p className="text-gray-700 leading-relaxed mb-4">
          Hər vakansiya öz orijinal mənbəsi ilə birlikdə göstərilir. Müraciət etmək üçün birbaşa həmin sayta yönləndirilirsiniz — vasitəçilik yoxdur.
        </p>
        <p className="text-gray-700 leading-relaxed">
          Platforma Azərbaycan, İngilis və Rus dillərini tam dəstəkləyir.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          ['Aktual', 'Mütəmadi yenilənir'],
          ['Çoxdilli', 'AZ / EN / RU'],
          ['Şəffaf', 'Mənbə hər zaman göstərilir'],
        ].map(([num, label]) => (
          <div key={label} className="bg-white border border-gray-200 rounded-2xl p-6 text-center shadow-sm">
            <div className="text-lg font-bold text-blue-600">{num}</div>
            <div className="text-sm text-gray-500 mt-1">{label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
        <h2 className="text-lg font-bold mb-2">Mənbə platformalar</h2>
        <p className="text-sm text-gray-500 mb-4">
          Elanlar aşağıdakı tanınmış Azərbaycan platformalarından toplanır. Hər vakansiyada orijinal mənbə göstərilir.
        </p>
        <div className="flex flex-wrap gap-2">
          {['boss.az', 'jobsearch.az', 'hellojob.az', 'smartjob.az', 'ejob.az', 'iseqebul.az', 'jooble.az', 'hrin.az'].map(s => (
            <a key={s} href={`https://${s}`} target="_blank" rel="noopener noreferrer"
              className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-sm text-gray-700 hover:border-blue-400 hover:text-blue-600 transition-colors">
              {s}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
