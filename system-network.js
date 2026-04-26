import * as THREE from "https://unpkg.com/three@0.165.0/build/three.module.js";

const container = document.getElementById("about-system-canvas");

if (container) {
  const aboutSection = container.closest(".about");
  const aboutText = aboutSection?.querySelector(".about__text");
  const aboutBody = aboutText?.querySelector(".about__body");
  const defaultBodyCopy = aboutBody?.innerHTML ?? "";

  const hoverName = null;


  const COLORS = {
    ink: 0x121b60,
    orange: 0xfb6a4f,
    lightBlue: 0x9ad7ff,
    turquoise: 0x45d6c7,
    green: 0x58c46b,
    white: 0xffffff,
    dim: 0xbfc5cf,
  };

  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  const clock = new THREE.Clock();
  const pointer = new THREE.Vector2(2, 2);
  const raycaster = new THREE.Raycaster();

  let hoveredSphere = null;
  let frozenElapsed = 0;
  let pauseStartedAt = null;
  let pausedDuration = 0;

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.innerHTML = "";
  container.appendChild(renderer.domElement);

  camera.position.set(0, 6.8, 4.25);
  camera.lookAt(0, 0, 0);

  scene.add(new THREE.AmbientLight(COLORS.white, 1.8));
  const key = new THREE.DirectionalLight(COLORS.white, 2.2);
  key.position.set(4, 6, 5);
  scene.add(key);

  const group = new THREE.Group();
  scene.add(group);

  const makeSphere = (radius, color, opacity = 1) => {
    const material = new THREE.MeshStandardMaterial({
      color,
      transparent: opacity < 1,
      opacity,
      roughness: 0.52,
      metalness: 0.05,
    });
    return new THREE.Mesh(new THREE.SphereGeometry(radius, 36, 24), material);
  };

  const core = makeSphere(0.38, COLORS.white);
  core.userData.name = "Tüpraş Yaşam";
  core.userData.description = "Tüpraş Yaşam; mesleki, sosyal, mental, fiziksel ve finansal boyutlarda tasarlanmış programlar, yan faydalar ve topluluklar ile çalışanlarımızı ve ailelerini merkeze alır.";
  group.add(core);

  const logoTexture = new THREE.TextureLoader().load("./assets/images/image.png");
  logoTexture.colorSpace = THREE.SRGBColorSpace;
  const coreLogo = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: logoTexture,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    })
  );
  coreLogo.renderOrder = 10;
  coreLogo.center.set(0.5, 0.5);
  coreLogo.scale.set(0.59, 0.31, 1);
  coreLogo.position.set(0, 0.38, 0.5);
  core.add(coreLogo);

  const primaryNodes = [
    { color: COLORS.ink, name: "Mesleki", description: "Mesleki boyut; gelişim, kariyer, akademi ve dönüşüm programları ile çalışma arkadaşlarımızın yetkinliklerini ve gelecek hazırlığını destekler." },
    { color: COLORS.lightBlue, name: "Finansal", description: "Finansal boyut; yan faydalar, aile destekleri ve esnek çözümler ile çalışanlarımızın ekonomik refahını güçlendirir." },
    { color: COLORS.turquoise, name: "Mental", description: "Mental boyut; psikolojik destekten gönüllülüğe kadar iyi oluşu, aidiyeti ve kapsayıcılığı besleyen uygulamaları bir araya getirir." },
    { color: COLORS.green, name: "Sosyal", description: "Sosyal boyut; etkinlikler, kulüpler, törenler ve çocuklara yönelik programlarla bir araya gelme kültürünü canlı tutar." },
    { color: COLORS.orange, name: "Fiziksel", description: "Fiziksel boyut; kampüs yaşamı, servis, yemek, spor ve sosyal tesis deneyimleriyle günlük hayatı destekler." },
  ];

  const primarySpheres = primaryNodes.map(({ color, name, description }) => {
    const sphere = makeSphere(0.2, color);
    sphere.userData.name = name;
    sphere.userData.description = description;
    group.add(sphere);
    return sphere;
  });

  const satelliteConfigs = [
    {
      parent: primarySpheres[0],
      color: COLORS.ink,
      radiusBase: 0.78,
      names: [
        "Yetenek Gelişimi",
        "Akademi",
        "Koç Kariyerim",
        "Unvan Tasarımı",
        "2050 Karbon Nötr Dönüşümü",
        "BiOmuzVer",
        "Koç Diyalog",
      ],
    },
    {
      parent: primarySpheres[1],
      color: COLORS.lightBlue,
      radiusBase: 0.86,
      names: [
        "Koç Ailem",
        "Anlık Çek",
        "Spot Bonus",
        "ZBB",
        "Koç Emeklilik Vakfı",
        "Kreş Yardımı",
        "Tokenflex",
        "Flextra",
      ],
    },
    {
      parent: primarySpheres[2],
      color: COLORS.turquoise,
      radiusBase: 0.82,
      names: [
        "Tüpraş Gönüllüleri",
        "Koç Healthcare",
        "Çeşitlilik, Eşitlik ve Kapsayıcılık Uygulamaları",
        "Zor Gün Desteği",
        "Psikolojik Danışmanlık ve Destek",
        "Jest",
      ],
    },
    {
      parent: primarySpheres[3],
      color: COLORS.green,
      radiusBase: 0.76,
      names: [
        "İletişim Toplantısı",
        "Kültür ve Sanat Faaliyetleri",
        "Kıdem Törenleri",
        "ŞEK",
        "Çocuk Spor Okulları",
      ],
    },
    {
      parent: primarySpheres[4],
      color: COLORS.orange,
      radiusBase: 0.84,
      names: [
        "Sosyal Tesisler",
        "İş Kıyafetleri",
        "Lojman / Görev Evi",
        "Spor Salonları & Kulüpleri",
        "Servis Deneyimi",
        "Yemek Deneyimi",
      ],
    },
  ];

  const satelliteClusters = satelliteConfigs.map((config) => {
    const children = config.names.map((name) => {
      const sphere = makeSphere(0.11, config.color, 0.7);
      sphere.userData.name = name;
      sphere.userData.description = `${name}, ${config.parent.userData.name.toLowerCase()} boyutundaki Tüpraş Yaşam uygulamalarından biridir.`;
      group.add(sphere);
      return sphere;
    });
    return { ...config, children };
  });

  const darkBlueCluster = satelliteClusters[0];
  const tertiaryConfigs = [
    {
      parent: darkBlueCluster.children[0],
      color: COLORS.ink,
      radiusBase: 0.42,
      names: ["Lead", "LiderSensin", "PLT Future", "PLT Vision", "PLT UP"],
    },
    {
      parent: darkBlueCluster.children[1],
      color: COLORS.ink,
      radiusBase: 0.42,
      names: [
        "RAYEP",
        "Teknik Gelişim Kataloğu",
        "Yetkinlik Gelişimi Kataloğu",
        "Çevik Dönüşüm",
        "Koç Akademi",
      ],
    },
  ];

  const tertiaryClusters = tertiaryConfigs.map((config) => {
    const children = config.names.map((name) => {
      const sphere = makeSphere(0.07, config.color, 0.3);
      sphere.userData.name = name;
      sphere.userData.description = `${name}, ${config.parent.userData.name.toLowerCase()} başlığının altındaki detay gelişim uygulamalarından biridir.`;
      group.add(sphere);
      return sphere;
    });
    return { ...config, children };
  });

  const allSatelliteSpheres = satelliteClusters.flatMap((cluster) => cluster.children);
  const tertiarySpheres = tertiaryClusters.flatMap((cluster) => cluster.children);
  const spheres = [core, ...primarySpheres, ...allSatelliteSpheres, ...tertiarySpheres];

  spheres.forEach((sphere) => {
    sphere.userData.baseColor = sphere.material.color.clone();
    sphere.userData.baseOpacity = sphere.material.opacity;
    sphere.userData.dimOpacity = Math.max(0.14, sphere.userData.baseOpacity * 0.38);
  });

  const connectionPairs = [];
  primarySpheres.forEach((sphere) => {
    connectionPairs.push([core, sphere]);
  });
  satelliteClusters.forEach((cluster) => {
    cluster.children.forEach((sphere) => {
      connectionPairs.push([cluster.parent, sphere]);
    });
  });
  tertiaryClusters.forEach((cluster) => {
    cluster.children.forEach((sphere) => {
      connectionPairs.push([cluster.parent, sphere]);
    });
  });

  const uniquePairs = Array.from(
    new Map(connectionPairs.map((pair) => [pair.map((sphere) => spheres.indexOf(sphere)).join("-"), pair])).values()
  );

  const lineMaterial = new THREE.LineBasicMaterial({
    color: COLORS.ink,
    transparent: true,
    opacity: 0.24,
  });
  const primaryLineMaterial = new THREE.LineBasicMaterial({
    color: COLORS.orange,
    transparent: true,
    opacity: 0.42,
  });

  const lines = uniquePairs.map(([start, end]) => {
    const geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
    const isCoreLink = start === core || end === core;
    const line = new THREE.Line(geometry, isCoreLink ? primaryLineMaterial.clone() : lineMaterial.clone());
    line.userData.start = start;
    line.userData.end = end;
    line.userData.baseColor = line.material.color.getHex();
    line.userData.baseOpacity = line.material.opacity;
    group.add(line);
    return { line, start, end };
  });

  const applyHoverState = (activeSphere) => {
    spheres.forEach((sphere) => {
      const isActive = !activeSphere || sphere === activeSphere;
      sphere.material.color.copy(isActive ? sphere.userData.baseColor : new THREE.Color(COLORS.dim));
      sphere.material.opacity = isActive ? sphere.userData.baseOpacity : sphere.userData.dimOpacity;
    });

    lines.forEach(({ line }) => {
      const isActive = !activeSphere || line.userData.start === activeSphere || line.userData.end === activeSphere;
      line.material.color.setHex(isActive ? line.userData.baseColor : 0xcdd2da);
      line.material.opacity = isActive ? line.userData.baseOpacity : 0.08;
    });

    if (aboutBody) {
      aboutBody.innerHTML = activeSphere ? activeSphere.userData.description : defaultBodyCopy;
    }
  };

  const resize = () => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);

    const scale = (width < 420 ? 0.76 : width < 560 ? 0.9 : width < 760 ? 1.02 : 1.12) * 1.12;
    group.scale.setScalar(scale);
  };

  resize();
  window.addEventListener("resize", resize);

  renderer.domElement.addEventListener("pointermove", (event) => {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  });

  renderer.domElement.addEventListener("pointerleave", () => {
    pointer.set(2, 2);
    hoveredSphere = null;
    pauseStartedAt = null;
    renderer.domElement.style.cursor = "";
    applyHoverState(null);
  });

  const animate = () => {
    const rawElapsed = clock.getElapsedTime();
    if (hoveredSphere && pauseStartedAt === null) {
      pauseStartedAt = rawElapsed;
      frozenElapsed = rawElapsed - pausedDuration;
    } else if (!hoveredSphere && pauseStartedAt !== null) {
      pausedDuration += rawElapsed - pauseStartedAt;
      pauseStartedAt = null;
    }

    const elapsed = hoveredSphere ? frozenElapsed : rawElapsed - pausedDuration;
    const time = elapsed * 1000;

    group.rotation.y = Math.sin(time * 0.0002) * 0.16;
    group.rotation.x = -0.3 + Math.sin(time * 0.00018) * 0.03;

    const primaryAngles = [0.18, 1.44, 2.58, 3.86, 5.02];
    const primaryOffsets = [0.42, 0.12, -0.3, -0.08, 0.34];
    primarySpheres.forEach((sphere, index) => {
      const angle = primaryAngles[index] + elapsed * 0.12 + Math.sin(time * 0.00016 + index) * 0.08;
      sphere.position.set(
        Math.cos(angle) * 1.72,
        primaryOffsets[index] + Math.sin(time * 0.00022 + index) * 0.08,
        Math.sin(angle) * 1.72
      );
      sphere.scale.setScalar(1 + Math.sin(time * 0.00055 + index) * 0.03);
    });

    satelliteClusters.forEach((cluster, clusterIndex) => {
      const parentPosition = cluster.parent.position.clone();
      const step = (Math.PI * 2) / cluster.children.length;
      cluster.children.forEach((sphere, index) => {
        const angle =
          step * index +
          elapsed * (0.16 + clusterIndex * 0.018) +
          Math.cos(time * 0.00032 + index + clusterIndex) * 0.08;
        const radius = cluster.radiusBase + (index % 2) * 0.14;
        const lift = Math.sin(time * 0.00034 + index + clusterIndex) * 0.09;
        sphere.position.set(
          parentPosition.x + Math.cos(angle) * radius,
          parentPosition.y + lift,
          parentPosition.z + Math.sin(angle) * radius
        );
        sphere.scale.setScalar(1 + Math.cos(time * 0.0008 + index + clusterIndex) * 0.04);
      });
    });

    tertiaryClusters.forEach((cluster, clusterIndex) => {
      const parentPosition = cluster.parent.position.clone();
      const step = (Math.PI * 2) / cluster.children.length;
      cluster.children.forEach((sphere, index) => {
        const angle =
          step * index -
          elapsed * (0.26 + clusterIndex * 0.04) +
          Math.sin(time * 0.00042 + index + clusterIndex) * 0.09;
        const radius = cluster.radiusBase + (index % 2) * 0.06;
        const lift = Math.cos(time * 0.00046 + index + clusterIndex) * 0.04;
        sphere.position.set(
          parentPosition.x + Math.cos(angle) * radius,
          parentPosition.y + lift,
          parentPosition.z + Math.sin(angle) * radius
        );
        sphere.scale.setScalar(1 + Math.sin(time * 0.001 + index + clusterIndex) * 0.03);
      });
    });

    lines.forEach(({ line, start, end }) => {
      line.geometry.setFromPoints([start.position, end.position]);
    });

    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(spheres, false)[0];
    const nextHoveredSphere = hit ? hit.object : null;
    if (nextHoveredSphere !== hoveredSphere) {
      hoveredSphere = nextHoveredSphere;
      renderer.domElement.style.cursor = hoveredSphere ? "pointer" : "";
      applyHoverState(hoveredSphere);
    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };

  applyHoverState(null);
  animate();
}
